import { Component } from "react";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";

import Toaster from "../../Toaster";
// import { HeaderMenu } from "../Header";
// import { RightArrow } from "../../public/static/vectors";

import CheckoutForm from "./components/CheckoutForm";
import CheckoutHeader from "./components/CheckoutHeader";
import CheckoutActions from "./components/CheckoutActions";
import PopupModal from "../../PopupModal";

import { checkoutService } from "./services/checkoutService";
import { deliveryService } from "./services/deliveryService";
import { validationService } from "./services/validationService";
import { initialFormData, DELIVERY_METHODS } from "./constants/checkoutConstants";

import analyticsService from "../../../services/analyticsService";
import { reduceArray, getFormValues, getRequestError } from "../../../utils/functions";
import { DELIVERY_DISCOUNT, STORE_ID } from "../../../constants";
import { AuthenticationConsumer } from "../../../providers/AuthenticationProvider";
import { CartConsumer } from "../../../providers/CartProvider";
import { StoreConsumer } from "../../../providers/StoreProvider";

class Checkout extends Component {
  state = {
    formData: { ...initialFormData },
    deliveryCost: 0,
    deliveryDiscount: DELIVERY_DISCOUNT,
    isDeliveryDiscountEligible: false,
    
    // Location state
    deliveryLocation: { address: "", latitude: "", longitude: "" },
    pickupLocation: { address: "", latitude: "", longitude: "" },
    selectedPickup: "",
    
    // City/State management
    chosenState: "",
    chosenCity: {},
    cities: [],
    storeCities: [],
    
    // UI state
    isMenuActive: false,
    isLoadingDeliveryPrice: false,
    isCheckingOut: false,
    touched: false,
    toaster: null,
    
    // Validation state
    priceCheck: false,
    cannotCheckout: false,
    excludedItem: [],
    allowedCategories: [],
    
    // Misc
    deliveryId: "",
    initialValue: "",
  };

  componentDidMount = async () => {
    await this.initializeCheckout();
  };

  componentDidUpdate(_, prevState) {
    this.checkDeliveryDiscountEligibility();
  }

  // ==================== Initialization ====================
  
  initializeCheckout = async () => {
    await this.props?.fetchStoreInfo();
    window.scrollTo(0, 0);

    const subTotal = reduceArray(this.props.cart, "totalCost");
    this.checkPrice(subTotal);

    await this.loadStoreData();
    this.loadUserData();
    this.checkProductAvailability();
  };

  loadStoreData = async () => {
    const currentStore = JSON.parse(localStorage.getItem("STORE_INFO"));
    if (!currentStore) return;

    this.setState({
      allowedCategories: JSON.parse(localStorage.getItem("gourmet-14-allowed") || "[]"),
    });

    // Setup delivery cities
    if (currentStore?.delivery_types?.length > 0) {
      const cities = deliveryService.buildCitiesArray(currentStore.delivery_types);
      this.setState({ cities, storeCities: cities });
    }
  };

  loadUserData = () => {
    const currentUser = localStorage.getItem("gourmet-twist-user");
    if (currentUser) {
      const userData = JSON.parse(currentUser).customer;
      const formData = validationService.patchFormValues(initialFormData, userData);
      
      this.setState({
        formData: {
          ...formData,
          shippingMethod: { value: "delivery", valid: true },
          address: { value: "", valid: false },
        },
      });
    }
  };

  // ==================== Form Handlers ====================

  handleFormChange = ({ target }, valid) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [target.name]: { value: target.value, valid },
        address: target.name === "shippingMethod" 
          ? { value: "", valid: false }
          : this.state.formData.address,
      },
      isLoadingDeliveryPrice: false,
      deliveryCost: target.name === "shippingMethod" ? 0 : this.state.deliveryCost,
    });
  };

  handleShippingMethodChange = async ({ target }, valid) => {
    const { value } = target;
    const { store } = this.props;

    if (DELIVERY_METHODS.includes(value)) {
      if (!store?.states?.length && !store?.delivery_types?.length) {
        this.openToaster("error", "The delivery system for this store is not available yet");
        return;
      }
    }

    this.updateShippingMethod(value);
  };

  updateShippingMethod = (value) => {
    const isPickup = value === "pickup" || value === "s-pickup";
    const isRegularDelivery = value === "pickup" || value === "delivery";

    this.setState({
      formData: {
        ...this.state.formData,
        shippingMethod: { value, valid: true },
        address: { 
          value: isPickup ? "" : this.state.formData.address.value,
          valid: isPickup 
        },
        deliveryDate: {
          value: isRegularDelivery ? new Date() : "",
          valid: isRegularDelivery,
        },
      },
      deliveryCost: isPickup ? 0 : this.state.deliveryCost,
    }, () => {
      if (DELIVERY_METHODS.includes(value) && 
          this.state.deliveryLocation.address && 
          Object.keys(this.state.chosenCity).length > 0) {
        this.calculateDeliveryFee();
      }
    });
  };

  handleDeliveryDateChange = (day) => {
    this.setState({
      formData: {
        ...this.state.formData,
        deliveryDate: { value: day || "", valid: true },
      },
    });

    this.checkProductAvailability(day);
  };

  handleCityChange = (e, id) => {
    const cityIndex = e ? e.target.value : id;

    if (!cityIndex || cityIndex === "0") {
      this.setState({ chosenCity: {}, deliveryCost: 0 });
      return;
    }

    const selectedCity = this.state.cities.find(
      (city) => city.key == cityIndex || city.id === cityIndex
    );

    if (selectedCity && Object.entries(selectedCity).length > 0) {
      this.setState({
        chosenCity: selectedCity,
        deliveryCost: parseInt(selectedCity.price),
      });
    } else {
      this.setState({ chosenCity: {}, deliveryCost: 0 });
    }
  };

  handleAddressSelect = async (suggest) => {
    if (!suggest) return;

    const addressData = deliveryService.extractAddressData(suggest);
    
    this.setState({
      formData: {
        ...this.state.formData,
        address: { value: addressData.fullAddress, valid: true },
      },
      deliveryLocation: addressData,
      isLoadingDeliveryPrice: false,
    }, () => {
      if (Object.keys(this.state.chosenCity).length > 0) {
        this.calculateDeliveryFee();
      }
    });
  };

  handleAddressChange = (suggest) => {
    if (suggest && suggest.length > 0) {
      this.setState({
        formData: {
          ...this.state.formData,
          address: { value: suggest, valid: true },
        },
        deliveryLocation: { address: suggest, latitude: 6.52, longitude: 3.37 },
      });
    } else {
      this.setState({
        formData: {
          ...this.state.formData,
          address: { value: "", valid: false },
        },
        deliveryCost: 0,
        deliveryLocation: { address: "", latitude: "", longitude: "" },
      });
    }
  };

  handlePickupLocationChange = (selectedValue) => {
    const pickupLocation = deliveryService.getPickupLocation(selectedValue);
    
    this.setState({
      selectedPickup: selectedValue,
      pickupLocation,
    });

    if (pickupLocation.id) {
      this.handleCityChange(null, pickupLocation.id);
    }
  };

  // ==================== Delivery Fee Calculation ====================

  calculateDeliveryFee = async () => {
    const { deliveryLocation, chosenCity, formData } = this.state;

    if (!deliveryLocation.address?.trim() || Object.keys(chosenCity).length < 1) {
      return;
    }

    if (!DELIVERY_METHODS.includes(formData.shippingMethod.value)) {
      return;
    }

    this.setState({ isLoadingDeliveryPrice: true });

    try {
      const deliveryData = await deliveryService.calculateDeliveryFee({
        shippingMethod: formData.shippingMethod.value,
        address: deliveryLocation.address,
        city: chosenCity.label,
        storeId: STORE_ID,
      });

      this.setState({
        chosenCity: { ...chosenCity, price: deliveryData.price },
        deliveryCost: deliveryData.price,
        deliveryId: deliveryData.id || "",
        isLoadingDeliveryPrice: false,
      });
    } catch (error) {
      const message = getRequestError(error);
      this.setState({
        isLoadingDeliveryPrice: false,
        deliveryCost: parseInt(chosenCity.price || 0),
      });
      console.error("Error getting delivery fee:", message);
      this.openToaster("error", message);
    }
  };

  // ==================== Validation ====================

  checkPrice = (subTotal) => {
    this.setState({ priceCheck: subTotal >= 2500 });
  };

  checkFormValidity = () => {
    return validationService.checkFormValidity(
      this.state.formData,
      this.state.selectedPickup
    );
  };

  checkProductAvailability = (selectedDate) => {
    const { allowedCategories, formData } = this.state;
    const { cart } = this.props;
    
    const result = validationService.checkProductAvailability(
      allowedCategories,
      cart,
      selectedDate || formData.deliveryDate.value
    );

    this.setState({
      cannotCheckout: result.cannotCheckout,
      excludedItem: result.excludedItems,
    });
  };

  checkDeliveryDiscountEligibility = () => {
    const { deliveryCost, chosenCity } = this.state;
    const { deliveryDiscountObject } = this.props;
    const subTotal = reduceArray(this.props.cart, "totalCost");

    const discountEligible = validationService.isDeliveryDiscountEligible(
      subTotal,
      deliveryCost,
      this.state.deliveryDiscount
    );

    if (discountEligible !== this.state.isDeliveryDiscountEligible && 
        chosenCity?.price && 
        deliveryDiscountObject?.id) {
      this.setState({ isDeliveryDiscountEligible: discountEligible });
    }
  };

  // ==================== Checkout ====================

  checkout = async () => {
    if (!this.checkFormValidity()) return;

    const checkoutData = this.prepareCheckoutData();
    
    this.setState({ isCheckingOut: true });

    try {
      const response = await checkoutService.processCheckout(checkoutData);
      
      analyticsService.trackEvent("purchase_response", response);
      
      this.setState({ isCheckingOut: false });
      
      if (response.checkoutLink) {
        window.location.href = response.checkoutLink;
      } else {
        checkoutService.initiatePayment(
          response,
          checkoutData.email,
          this.handlePaymentSuccess,
          this.handlePaymentClose
        );
      }
    } catch (error) {
      const message = getRequestError(error);
      this.setState({ isCheckingOut: false });
      this.openToaster("error", message);
    }
  };

  prepareCheckoutData = () => {
    const { formData, deliveryCost, chosenCity, deliveryLocation, pickupLocation } = this.state;
    const { cart, user, couponObject, giftCardObject, deliveryDiscountObject, loyaltyPointApplied } = this.props;
    
    const formValues = getFormValues(formData);
    
    return checkoutService.prepareCheckoutPayload({
      formValues,
      cart,
      deliveryCost,
      chosenCity,
      deliveryLocation,
      pickupLocation,
      couponObject,
      giftCardObject,
      deliveryDiscountObject,
      loyaltyPointApplied,
      storeId: STORE_ID,
    });
  };

  handlePaymentSuccess = (response) => {
    const { clearCart, showCheckoutSuccess } = this.props;
    clearCart();
    showCheckoutSuccess(true);
    analyticsService.trackEvent("Paystack_successful", response);
  };

  handlePaymentClose = () => {
    analyticsService.trackEvent("Paystack_interface_closed", {
      category: "Paystack Checkout",
      label: "Paystack interface closed",
    });
  };

  // ==================== UI Helpers ====================

  openToaster = (status, message) => {
    this.setState({ toaster: { status, message } });
  };

  closeToaster = () => {
    this.setState({ toaster: null });
  };

  showMenu = (isMenuActive) => {
    this.setState({ isMenuActive });
  };

  // ==================== Render ====================

  render() {
    const {
      toaster,
      deliveryCost,
      isCheckingOut,
      formData,
      isLoadingDeliveryPrice,
      isMenuActive,
      cannotCheckout,
      excludedItem,
      priceCheck,
      cities,
      chosenCity,
      deliveryLocation,
      selectedPickup,
    } = this.state;

    const {
      cart,
      goBack,
      couponObject,
      giftCardObject,
      deliveryDiscountObject,
      loyaltyPointApplied,
    } = this.props;

    const subTotal = reduceArray(cart, "totalCost");
    console.log({
      subTotal,
      deliveryCost,
      chosenCity,
      deliveryDiscount: this.state.deliveryDiscount,
      couponObject,
      giftCardObject,
      deliveryDiscountObject,
      loyaltyPointApplied,
    });
    const finalAmount = checkoutService.calculateFinalAmount({
      subTotal,
      deliveryCost,
      chosenCity,
      deliveryDiscount: this.state.deliveryDiscount,
      couponObject,
      giftCardObject,
      deliveryDiscountObject,
      loyaltyPointApplied,
    });

    return (
      <div className="cart-container">
        <CheckoutHeader
          goBack={goBack}
          priceCheck={priceCheck}
          isMenuActive={isMenuActive}
          showMenu={this.showMenu}
        />

        <CheckoutForm
          formData={formData}
          cities={cities}
          chosenCity={chosenCity}
          deliveryLocation={deliveryLocation}
          selectedPickup={selectedPickup}
          isLoadingDeliveryPrice={isLoadingDeliveryPrice}
          onFormChange={this.handleFormChange}
          onShippingMethodChange={this.handleShippingMethodChange}
          onCityChange={this.handleCityChange}
          onAddressSelect={this.handleAddressSelect}
          onAddressChange={this.handleAddressChange}
          onDeliveryDateChange={this.handleDeliveryDateChange}
          onPickupLocationChange={this.handlePickupLocationChange}
        />

        <CheckoutActions
          subTotal={subTotal}
          deliveryCost={deliveryCost}
          finalAmount={finalAmount}
          shippingMethod={formData.shippingMethod.value}
          chosenCity={chosenCity}
          deliveryDiscount={this.state.deliveryDiscount}
          deliveryDiscountObject={deliveryDiscountObject}
          isCheckingOut={isCheckingOut}
          isLoadingDeliveryPrice={isLoadingDeliveryPrice}
          priceCheck={priceCheck}
          cannotCheckout={cannotCheckout}
          isFormValid={this.checkFormValidity()}
          onCheckout={this.checkout}
        />

        {cannotCheckout && (
          <PopupModal
            OkText="Change product or date"
            text={{
              main: "Sorry! Your cart contains products that cannot be ordered for the selected date:",
              sub: excludedItem.join(", "),
            }}
          />
        )}

        <PopupModal
          OkText="I understand"
          text={{
            main: "Orders placed after 6:00 PM will be processed the next business day.",
            sub: "Items not readily available require fresh processing (avg 3 hours prep time).",
          }}
        />

        {toaster && <Toaster {...toaster} closeToaster={this.closeToaster} />}
      </div>
    );
  }
}

export default StoreConsumer(CartConsumer(AuthenticationConsumer(Checkout)));