import { Component, Fragment, useEffect } from "react";
import Geosuggest from "react-geosuggest";
import * as classNames from "classnames";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";

import { AuthenticationConsumer } from "../../providers/AuthenticationProvider";
import { CartConsumer } from "../../providers/CartProvider";
import { StoreConsumer } from "../../providers/StoreProvider";

import { TextField } from "../FormElements";
import Toaster from "../Toaster";

import {
  postRequest,
  getRequest,
  getUserDetails,
  chowdeckConnect,
} from "../../api";
import { RightArrow } from "../../public/static/vectors";
import {
  reduceArray,
  getFormValues,
  getRequestError,
  paystack,
  patchFormValues,
  dynamicSort,
  sendOrderToWhatsApp,
} from "../../utils/functions";

import { deliveryPoints } from "../../utils/data";
import { HeaderMenu } from "../Header";
import {
  API_BASE_URL,
  CHOWDECK_API_URL,
  KITCHEN_LOCATION,
  STORE_ID,
} from "../../constants";
import SelectField from "../FormElements/SelectField";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { SearchOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import Axios from "axios";
import analyticsService from "../../services/analyticsService";
import { getCoordinates } from "../../services/geoLocation";
// import { useSearchParams } from "next/navigation";

const deliveryArr = ["delivery", "s-delivery", "c-delivery", "sc-delivery"];

const initialFormData = {
  name: {
    value: "",
    valid: false,
  },
  phoneNumber: {
    value: "",
    valid: false,
  },
  email: {
    value: "",
    valid: false,
  },
  address: {
    value: "",
    valid: false,
  },
  deliveryDate: {
    value: "",
    valid: true,
  },
  note: {
    value: "",
    valid: true,
  },
  shippingMethod: {
    value: "delivery",
    valid: true,
  },
};

class Checkout extends Component {
  state = {
    isDeliveryDiscountEligible: false,
    formData: { ...initialFormData },
    deliveryCost: 0,
    isMenuActive: false,
    isLoadingDeliveryPrice: false,
    pickUpAddress: {},
    states: [],
    cities: [],
    chosenState: "",
    chosenCity: {},
    touched: false,
    priceCheck: false,
    deliveryErrFlag: false,
    pickupErrFlag: false,
    storeCities: [],
    initialValue: "",
    deliveryId: "",
    deliveryLocation: {
      address: "",
      latitude: "",
      longitude: "",
    },
    pickupLocation: {
      address: "",
      latitude: "",
      longitude: "",
    },
    selectedPickup: "",
    isCheckingOut: false,
    paymentStatus: "idle", // idle | loading | success | failed
  };

  checkPrice = (subTotal) => {
    if (subTotal < 2500) {
      this.setState({
        priceCheck: false,
      });
    } else {
      this.setState({
        priceCheck: true,
      });
    }
  };

  handleChange = ({ target }, valid) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [target.name]: {
          value: target.value,
          valid,
        },
        address:
          target.name === "shippingMethod"
            ? {
                value: "",
                valid: false,
              }
            : this.state.formData.address,
      },
      isLoadingDeliveryPrice: false,
      deliveryCost:
        target.name === "shippingMethod" ? 0 : this.state.deliveryCost,
    });
  };

  handleDeliveryChange = ({ target }, valid) => {
    const { value } = target;
    this.resetDelivery(value);
    console.log("delviery changed: ", value, deliveryArr);
    if (deliveryArr.includes(value)) {
      const { store } = this.props;
      if (store?.states?.length < 1 && store?.delivery_types?.length < 1) {
        this.openToaster(
          "error",
          "The delivery system for this store is not available yet"
        );
      } else {
        this.effectDeliveryChange(value);
      }
    } else {
      this.effectDeliveryChange(value);
    }
  };

  effectDeliveryChange = (value) => {
    console.log(value);
    this.setState(
      {
        formData: {
          ...this.state.formData,
          shippingMethod: {
            value,
            valid: true,
          },
          address: {
            value:
              value === "s-pickup" || value === "pickup"
                ? ""
                : this.state.formData.address.value,
            valid: value === "s-pickup" || value === "pickup",
          },
          deliveryDate: {
            value: value === "pickup" || value === "delivery" ? new Date() : "",
            valid: value === "pickup" || value === "delivery" ? true : false,
          },
        },
        isLoadingDeliveryPrice: false,
        deliveryCost:
          value === "pickup" || value === "s-pickup"
            ? 0
            : this.state.deliveryCost,
      },
      () => {
        // Recalculate delivery fee if address and city are already selected
        if (
          deliveryArr.includes(value) &&
          this.state.deliveryLocation.address &&
          Object.keys(this.state.chosenCity).length > 0
        ) {
          this.handleGetDeliveryFee();
        }
      }
    );
  };

  resetDelivery = (value) => {
    this.setState({
      formData: {
        ...this.state.formData,
        shippingMethod: {
          value: "",
          valid: false,
        },
        address: {
          value: "",
          valid: false,
        },
        deliveryDate: {
          value: "",
          valid: true,
        },
      },
      deliveryCost: 0,
      chosenState: "lagos",
      chosenCity: {},
      touched: false,
      cities: [...this.state.storeCities],
      deliveryLocation: {
        address: "",
        latitude: "6.5244",
        longitude: "3.3792",
      },
      pickupLocation: {
        address: "",
        latitude: "",
        longitude: "",
      },
      selectedPickup: "",
      initialValue: "",
      deliveryId: "",
    });
  };

  handleDeliveryDateChange = (day) => {
    this.setState({
      formData: {
        ...this.state.formData,
        deliveryDate: {
          value: day || "",
          valid: true,
        },
      },
    });
  };

  checkFormValidity = () => {
    const { address, ...rest } = this.state.formData;
    const { shippingMethod } = this.state.formData;

    const isPickupValid =
      shippingMethod.value === "pickup" || shippingMethod.value === "s-pickup"
        ? this.state.selectedPickup !== ""
        : true;

    return Object.values(rest).every(
      (value) =>
        value.valid &&
        (deliveryArr.includes(shippingMethod.value) ? address.valid : true) &&
        isPickupValid
    );
  };

  onSuggestSelect = async (suggest) => {
    this.setState(
      {
        formData: {
          ...this.state.formData,
          address: {
            value: "",
            valid: false,
          },
        },
        deliveryCost: 0,
        isLoadingDeliveryPrice: true,
      },
      async () => {
        if (suggest) {
          const address = suggest.gmaps?.formatted_address || suggest.label;
          const fullAddress = suggest.label;
          const latitude = suggest.location.lat;
          const longitude = suggest.location.lng;

          this.setState(
            {
              formData: {
                ...this.state.formData,
                address: {
                  value: fullAddress,
                  valid: true,
                },
              },
              deliveryLocation: {
                address: fullAddress,
                latitude,
                longitude,
              },
              isLoadingDeliveryPrice: false,
            },
            () => {
              // Calculate delivery fee after address is set
              if (Object.keys(this.state.chosenCity).length > 0) {
                this.handleGetDeliveryFee();
              }
            }
          );
        }
      }
    );
  };

  onSuggestChange = async (suggest) => {
    if (suggest && suggest.length > 0) {
      this.setState({
        formData: {
          ...this.state.formData,
          address: {
            value: suggest,
            valid: true,
          },
        },
        deliveryLocation: {
          address: suggest,
          latitude: 6.52,
          longitude: 3.37,
        },
        isLoadingDeliveryPrice: false,
      });
    } else {
      this.setState({
        formData: {
          ...this.state.formData,
          address: {
            value: "",
            valid: false,
          },
        },
        deliveryCost: 0,
        deliveryLocation: {
          address: "",
          latitude: "",
          longitude: "",
        },
        isLoadingDeliveryPrice: false,
      });
    }
  };

  onSuggestNoResults = (userInput) => {};

  handleGetDeliveryFee = async () => {
    const { deliveryLocation, chosenCity, formData } = this.state;
    const { store } = this.props;

    console.log(deliveryLocation, chosenCity);

    if (!deliveryLocation.address || deliveryLocation.address.trim() === "") {
      return;
    }

    if (Object.keys(chosenCity).length < 1) {
      return;
    }

    // Only calculate for delivery methods that require it
    if (!deliveryArr.includes(formData.shippingMethod.value)) {
      console.log("method not found");
      return;
    }

    this.setState({
      isLoadingDeliveryPrice: true,
    });

    try {
      // Check if it's Chowdeck delivery
      if (
        formData.shippingMethod.value === "c-delivery" ||
        formData.shippingMethod.value === "sc-delivery"
      ) {
        const res = await postRequest({
          url: `${API_BASE_URL}customer-requests/stores/${STORE_ID}/chowdeck-delivery-fee`,
          data: {
            address: deliveryLocation.address,
            city: chosenCity.label,
          },
        });

        console.log(res.data);
        const { total_amount, id } = res.data;
        this.setState({
          chosenCity: {
            ...chosenCity,
            price: parseInt(total_amount / 100),
          },
          deliveryCost: parseInt(total_amount / 100),
          deliveryId: id,
          isLoadingDeliveryPrice: false,
        });
      } else {
        // For Glovo delivery, use the city price
        this.setState({
          deliveryCost: parseInt(chosenCity.price || 0),
          isLoadingDeliveryPrice: false,
        });
      }
    } catch (error) {
      const message = getRequestError(error);
      this.setState({
        isLoadingDeliveryPrice: false,
        deliveryCost: parseInt(chosenCity.price || 0), // Fallback to city price
      });
      console.log("Error getting delivery fee:", message);
      this.openToaster("error", message);
    }
  };

  computeDistance(pointA, pointB) {
    const lat1 = pointA.location.lat;
    const lon1 = pointA.location.lng;

    const lat2 = pointB.lat;
    const lon2 = pointB.lon;

    const R = 6371e3; // earth radius in meters
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * (Math.sin(Δλ / 2) * Math.sin(Δλ / 2));

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  }

  checkout = async () => {
    const {
      formData,
      deliveryCost,
      chosenCity,
      deliveryLocation,
      pickupLocation,
      selectedPickup,
      isDeliveryDiscountEligible,
    } = this.state;
    const {
      name,
      phoneNumber,
      address,
      email,
      note,
      shippingMethod,
      deliveryDate,
    } = getFormValues(formData);
    const {
      cart,
      user,
      couponObject,
      giftCardObject,
      deliveryDiscountObject,
      loyaltyPointApplied,
      loyaltyPointsAvailable,
    } = this.props;

    console.log("cart item: ", cart);

    const orderItems = cart.map(({ id, quantity, name, size, toppings }) => ({
      productId: id,
      name,
      size,
      quantity,
      toppings: toppings.map((topping) => ({
        productId: topping.id,
        quantity: topping.quantity || 1,
      })),
    }));

    this.setState({
      isCheckingOut: true,
    });

    const loggedInCustomer = getUserDetails()?.customer;

    const payload = {
      state: "lagos",
      city: chosenCity?.label,
      deliveryTypeId: deliveryDiscountObject?.id || chosenCity?.key,
      originalDeliveryTypeId: chosenCity?.key,
      specialNote: note,
      orderItems,
      customer: {
        name: loggedInCustomer?.name || name,
        phoneNumber: loggedInCustomer?.phoneNumber || phoneNumber,
        address: loggedInCustomer?.address || address,
        email: loggedInCustomer?.email || email,
      },
      recipient: {
        name,
        phoneNumber,
      },
      deliveryDate: deliveryDate || null,
      deliveryLocation,
    };

    if (shippingMethod === "pickup" || shippingMethod === "s-pickup") {
      payload.pickupLocation = pickupLocation;
      payload.city = "Pickup";
    }

    if (couponObject) {
      payload.discountType = couponObject.discountType;
      payload.discountValue = couponObject.value;
    }

    const subTotal = reduceArray(cart, "totalCost");

    const ttlGcDiscount = giftCardObject?.remainingValue || 0;

    let discountAmountGc =
      ttlGcDiscount > subTotal + deliveryCost
        ? subTotal + deliveryCost
        : ttlGcDiscount;

    if (giftCardObject) {
      payload.discountGcCode = giftCardObject.code;
      payload.discountValueGc = discountAmountGc;
    }

    if (
      loyaltyPointApplied?.value &&
      discountAmountGc < subTotal + deliveryCost
    ) {
      let loyaltyPointsToRedeem = parseFloat(loyaltyPointApplied.value);

      if (
        parseFloat(ttlGcDiscount) + loyaltyPointsToRedeem >
        subTotal + deliveryCost
      )
        loyaltyPointsToRedeem =
          subTotal + deliveryCost - parseFloat(ttlGcDiscount);

      payload.loyaltyPointsDiscountRedeemed = loyaltyPointsToRedeem;
      payload.loyaltyPointsRedeemed = Math.ceil(
        loyaltyPointsToRedeem / loyaltyPointsAvailable.discountPerPoint
      );
    }

    if (shippingMethod === "pickup" || shippingMethod === "s-pickup") {
      payload.deliveryLocation = payload.pickupLocation;
    }

    analyticsService.trackPurchase({
      ...payload,
    });

    try {
      const res = await postRequest({
        url: `/customer-requests/stores/${STORE_ID}/placed-orders`,
        data: payload,
      });

      const { paymentReference, amount, checkoutLink } = res.data;
      analyticsService.trackEvent("purchase_response", {
        ...res.data,
      });

      this.setState({ isCheckingOut: false });
      // return sendOrderToWhatsApp(payload, amount);

      let discountAmount = couponObject
        ? couponObject.discountType === "percent"
          ? (couponObject.value * subTotal) / 100
          : couponObject.value
        : null;

      const loyaltyDiscountApplied = parseFloat(loyaltyPointApplied.value || 0);

      if (loyaltyDiscountApplied)
        discountAmount = (discountAmount || 0) + loyaltyDiscountApplied;

      if (ttlGcDiscount) discountAmount = (discountAmount || 0) + ttlGcDiscount;

      let metadata = {
        storeID: STORE_ID,
      };

      let finalAmount = subTotal + deliveryCost - discountAmount;
      let finalAmountWithoutDeliveryFee = subTotal - discountAmount;

      if (finalAmount <= 0) finalAmount = 0;

      if (discountAmount > subTotal + deliveryCost) finalAmount = 0;

      if (deliveryDiscountObject?.id) {
        if (this.state.chosenCity?.price > 3000)
          finalAmountWithoutDeliveryFee += this.state.chosenCity?.price - 3000;
        finalAmount = finalAmountWithoutDeliveryFee;
      }

      const costToCompare =
        subTotal +
        (subTotal >= 25000 ? Math.max(deliveryCost - 3000, 0) : deliveryCost);

      if (costToCompare !== amount) {
        analyticsService.trackEvent("Payment failed", {
          category: "Checkout",
          label: "Payment not match",
          costToCompare,
          amount,
        });
        this.setState({
          isCheckingOut: false,
        });
        this.openToaster(
          "error",
          "Cart items are not valid. May be the products are updated. Please remove current cart and add the items again. Thanks"
        );
        return;
      }

      if (checkoutLink) {
        window.location.href = checkoutLink;
      }

      // paystack(
      //   email,
      //   paymentReference,
      //   parseFloat(finalAmount == 0 ? 0.01 : finalAmount) * 100,
      //   this.handlePaystackSuccess,
      //   this.handlePaystackClose,
      //   metadata
      // );

      this.setState({
        isCheckingOut: false,
      });
    } catch (error) {
      const message = getRequestError(error);

      this.setState({
        isCheckingOut: false,
      });

      this.openToaster("error", message);
    } finally {
      this.setState({ isCheckingOut: false });
    }
  };

  handlePaystackSuccess = (response) => {
    const { clearCart, showCheckoutSuccess } = this.props;
    clearCart();
    showCheckoutSuccess(true);
    analyticsService.trackEvent("Paystack_successful", { ...response });
  };

  handlePaystackClose = () => {
    analyticsService.trackEvent("Paystack_interface_closed", {
      category: "Paystack Checkout",
      label: "Paystack interface closed",
    });
  };

  openToaster = (status, message) => {
    this.setState({
      toaster: {
        status,
        message,
      },
    });
  };

  closeToaster = () => {
    this.setState({
      toaster: null,
    });
  };

  showMenu = (isMenuActive) => {
    this.setState({ isMenuActive });
  };

  capitalizeWord = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  };

  componentDidMount = async () => {
    await this.props?.fetchStoreInfo();
    window.scrollTo(0, 0);
    const currentUser = localStorage.getItem("gourmet-twist-user");
    const currentStore = JSON.parse(localStorage.getItem("STORE_INFO"));

    const subTotal = reduceArray(this.props.cart, "totalCost");
    this.checkPrice(subTotal);

    // Check if pickup is enabled and address set for pickup option
    if (currentStore) {
      if (currentStore?.newAddress === null || !currentStore?.pickup) {
        this.setState({
          pickupErrFlag: true,
        });
      } else {
        this.setState({
          pickupErrFlag: false,
          pickUpAddress: {
            ...currentStore?.newAddress,
          },
        });
      }
    }

    if (currentUser) {
      const formData = patchFormValues(
        initialFormData,
        JSON.parse(currentUser).customer
      );

      this.setState({
        formData: {
          ...formData,
          shippingMethod: {
            value: "delivery",
            valid: true,
          },
          address: {
            value: "",
            valid: false,
          },
        },
      });
    }

    //build up cities object
    if (currentStore?.delivery_types?.length > 0) {
      let newStateArr = [];

      currentStore &&
        currentStore.delivery_types.sort(dynamicSort("name")).map((item) => {
          let newObj = {};
          if (
            item.name.toLowerCase().includes("gtfree") ||
            item.name.toLowerCase().includes("gtlove")
          )
            return;
          newObj.key = item.id;
          newObj.label = `${this.capitalizeWord(item.name.toLowerCase())}`;
          newObj.price = item.price;
          newStateArr.push(newObj);
        });

      let sortedArr = newStateArr.sort(function (a, b) {
        let nameA = a.label.toLowerCase();
        let nameB = b.label.toLowerCase();
        return nameA > nameB;
      });

      sortedArr.unshift({
        key: 0,
        label: "Choose a city/area",
        price: 0,
      });

      this.setState({
        cities: [...sortedArr],
        storeCities: [...sortedArr],
      });
    } else {
      this.setState({
        deliveryErrFlag: true,
      });
      this.openToaster(
        "error",
        "Delivery not available in this state yet, you can choose PICKUP or SCHEDULED delivery"
      );
    }
  };

  componentDidUpdate(_, prevState) {
    const { deliveryCost, isDeliveryDiscountEligible, chosenCity } = this.state;
    const subTotal = reduceArray(this.props.cart, "totalCost");
    const discountEligible = subTotal >= 25000 && deliveryCost <= 3000;

    if (
      discountEligible !== isDeliveryDiscountEligible &&
      chosenCity?.price &&
      this.props.deliveryDiscountObject?.id
    ) {
      this.setState({
        isDeliveryDiscountEligible: discountEligible,
      });
    }
  }

  handleCityChange = (e) => {
    let cityIndex = e.target.value;

    if (cityIndex === "" || cityIndex === "0") {
      this.setState({
        chosenCity: {},
        deliveryCost: 0,
      });
      return;
    }

    let found = this.state.cities.find((elem) => {
      return elem.key == cityIndex;
    });
    if (found) {
      if (Object.entries(found).length > 0) {
        this.setState({
          formData: {
            ...this.state.formData,
          },
          chosenCity: { ...found },
          deliveryCost: parseInt(found.price),
        });
      }
    } else {
      this.setState({
        formData: {
          ...this.state.formData,
        },
        chosenCity: {},
        deliveryCost: 0,
      });
    }
  };

  render() {
    const {
      toaster,
      deliveryCost,
      isCheckingOut,
      formData,
      isLoadingDeliveryPrice,
      isMenuActive,
      initialValue,
      isDeliveryDiscountEligible,
    } = this.state;
    const {
      cart,
      goBack,
      couponObject,
      giftCardObject,
      deliveryDiscountObject,
      loyaltyPointApplied,
    } = this.props;
    const { name, phoneNumber, email, shippingMethod, note, deliveryDate } =
      formData;

    const subTotal = reduceArray(cart, "totalCost");
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const disabledModifiers = {
      modifiers: {
        disabled: [
          {
            before: tomorrow,
          },
        ],
      },
    };

    const loyaltyDiscountApplied = parseFloat(loyaltyPointApplied?.value || 0);

    const ttlGcDiscount = giftCardObject?.remainingValue || 0;

    let discountAmount = couponObject
      ? couponObject.discountType === "percent"
        ? (couponObject.value * subTotal) / 100
        : couponObject.value
      : null;

    if (deliveryDiscountObject?.id) {
      discountAmount += deliveryCost;
      discountAmount -= deliveryDiscountObject?.price;
    }

    if (loyaltyDiscountApplied)
      discountAmount = (discountAmount || 0) + loyaltyDiscountApplied;

    if (ttlGcDiscount) discountAmount = (discountAmount || 0) + ttlGcDiscount;

    let finalAmount = subTotal + deliveryCost - (discountAmount || 0);

    if (discountAmount > subTotal + deliveryCost) finalAmount = 0;

    if (this.state.chosenCity?.price > 3000 && deliveryDiscountObject?.id)
      finalAmount += this.state.chosenCity?.price - 3000;

    return (
      <div className="cart-container">
        <div className="cart-header">
          <div
            className="container login-header-inner"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="back" onClick={goBack}>
              <RightArrow />
            </div>
            <div className="title">Checkout</div>
            <div
              className="header-icon-container hamburger-menu right-menu"
              style={{ top: "-12px" }}
              onClick={() => this.showMenu(true)}
            >
              <span></span>
            </div>
            <CSSTransitionGroup
              transitionName="header-menu-animation"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={300}
            >
              {isMenuActive && <HeaderMenu showMenu={this.showMenu} />}
            </CSSTransitionGroup>
          </div>

          {this.state.priceCheck ? (
            <div className="info">
              <span className="icon checkout-icon">
                <img src="/static/images/star.png" alt="" />
              </span>
              <span className="text">Well done! You're almost there</span>
            </div>
          ) : (
            <div className="info">
              <span className="icon checkout-icon">
                <img src="/static/images/star.png" alt="" />
              </span>
              <span
                className="text"
                style={{
                  textAlign: "center",
                }}
              >
                Minimum item price for checkout is ₦2500
              </span>
            </div>
          )}
        </div>
        <div className="checkout-form">
          <div className="container">
            <div className="description">Marked fields are compulsory</div>
            <TextField
              label="Receiver's Name"
              placeholder="Enter the receiver's name"
              name="name"
              value={name.value}
              onChange={this.handleChange}
              className="mb-40"
              required
            />
            <TextField
              label="Email Address (for payment receipt)"
              placeholder="Enter your email address"
              type="email"
              name="email"
              value={email.value}
              onChange={this.handleChange}
              className="mb-40"
              required
            />
            <TextField
              label="Receiver's Phone Number"
              placeholder="Enter the receiver's phone number"
              name="phoneNumber"
              value={phoneNumber.value}
              onChange={this.handleChange}
              className="mb-40"
              hint="11 digits required"
              required
              mobile
            />
          </div>
          <div className="shipping-method">
            <div className="container">
              <SelectField
                label="Select Delivery Type"
                required
                hint="Pickup, Delivery or Scheduled"
                onChange={this.handleDeliveryChange}
                options={[
                  {
                    key: "delivery",
                    label: "Delivery",
                  },
                  // {
                  //   key: "c-delivery",
                  //   label: "Chowdeck Delivery",
                  // },
                  {
                    key: "pickup",
                    label: "Pickup",
                  },
                  {
                    key: "s-delivery",
                    label: "Scheduled Delivery",
                  },
                  // {
                  //   key: "sc-delivery",
                  //   label: "Scheduled Chowdeck Delivery",
                  // },
                  {
                    key: "s-pickup",
                    label: "Scheduled Pickup",
                  },
                ]}
              />
              {shippingMethod.value === "delivery" ? (
                <Fragment>
                  <div className="input-container mb-40">
                    <Fragment>
                      <SelectField
                        label="City"
                        required
                        hint="City"
                        onChange={this.handleCityChange}
                        options={this.state.cities}
                      />

                      {Object.entries(this.state.chosenCity).length < 1 && (
                        <span className="hint flashing-red blink_me">
                          Choose a city/area
                        </span>
                      )}
                    </Fragment>
                  </div>
                  <div className="input-container mb-40">
                    <label>
                      Delivery Address <sup className="marked">*</sup>
                      {isLoadingDeliveryPrice && (
                        <i
                          style={{
                            textTransform: "capitalize",
                            color: "#333",
                            fontWeight: "bold",
                          }}
                        >
                          {" "}
                          Calculating Price...{" "}
                        </i>
                      )}
                    </label>
                    <Geosuggest
                      placeholder="Enter your address"
                      country="ng"
                      onSuggestSelect={this.onSuggestSelect}
                      onChange={this.onSuggestChange}
                      onSuggestNoResults={this.onSuggestNoResults}
                      queryDelay={600}
                      onBlur={this.handleGetDeliveryFee}
                      initialValue={initialValue}
                    />
                    {Object.entries(this.state.deliveryLocation).length < 1 && (
                      <span className="hint flashing-red blink_me">
                        Please enter a more specific address for delivery
                      </span>
                    )}
                  </div>
                </Fragment>
              ) : shippingMethod.value === "pickup" ? (
                <div className="input-container mb-40">
                  <SelectField
                    label="Pickup Address"
                    required
                    hint="Choose pickup location"
                    onChange={(e) => {
                      const selected = e.target.value;
                      let pickupLoc = {};
                      if (selected === "1") {
                        pickupLoc = {
                          address:
                            "19B Fola Osibo, Lekki Phase 1, Lekki, Nigeria",
                          latitude: 6.430118879280349,
                          longitude: 3.4881381695005618,
                        };
                      } else if (selected === "2") {
                        pickupLoc = {
                          address:
                            "13b Methodist Church St, Opebi, Lagos 101233, Lagos, Nigeria",
                          latitude: 6.5244,
                          longitude: 3.3792,
                        };
                      }
                      this.setState({
                        selectedPickup: selected,
                        pickupLocation: pickupLoc,
                      });
                    }}
                    options={[
                      {
                        key: "",
                        label: "Choose pickup location",
                      },
                      {
                        key: "1",
                        label: "19B Fola Osibo, Lekki Phase 1, Lekki, Nigeria",
                      },
                      {
                        key: "2",
                        label:
                          "13b Methodist Church St, Opebi, Lagos 101233, Lagos, Nigeria",
                      },
                    ]}
                  />
                </div>
              ) : shippingMethod.value === "s-delivery" ? (
                <>
                  <div className="input-container mb-40">
                    <Fragment>
                      <SelectField
                        label="City"
                        required
                        hint="City"
                        onChange={this.handleCityChange}
                        options={this.state.cities}
                      />

                      {Object.entries(this.state.chosenCity).length < 1 && (
                        <span className="hint flashing-red blink_me">
                          Choose a city/area
                        </span>
                      )}
                    </Fragment>
                  </div>
                  <div className="input-container mb-40">
                    <label>
                      Delivery Address <sup className="marked">*</sup>
                      {isLoadingDeliveryPrice && (
                        <i
                          style={{
                            textTransform: "capitalize",
                            color: "#333",
                            fontWeight: "bold",
                          }}
                        >
                          {" "}
                          Calculating Price...{" "}
                        </i>
                      )}
                    </label>
                    <Geosuggest
                      placeholder="Enter your address"
                      country="ng"
                      onSuggestSelect={this.onSuggestSelect}
                      onChange={this.onSuggestChange}
                      onSuggestNoResults={this.onSuggestNoResults}
                      queryDelay={600}
                    />
                    {Object.entries(this.state.deliveryLocation).length < 1 && (
                      <span className="hint flashing-red blink_me">
                        Please enter a more specific address for delivery
                      </span>
                    )}
                    {/* <span className="hint flashing-red blink_me">
                      {" "}
                      If your delivery address is not auto-detected, enter your
                      city e.g Lekki Phase 1 or Surulere
                    </span> */}
                  </div>
                  <div className="input-container mb-40">
                    <label>
                      Delivery Date <sup className="marked">*</sup>
                    </label>
                    <DayPickerInput
                      dayPickerProps={disabledModifiers}
                      value={deliveryDate.value}
                      onDayChange={this.handleDeliveryDateChange}
                      placeholder="DD/MM/YYYY"
                      format="DD/MM/YYYY"
                    />
                  </div>
                </>
              ) : shippingMethod.value === "s-pickup" ? (
                <>
                  <div className="input-container mb-40">
                    <SelectField
                      label="Pickup Address"
                      required
                      hint="Choose pickup location"
                      onChange={(e) => {
                        const selected = e.target.value;
                        let pickupLoc = {};
                        if (selected === "1") {
                          pickupLoc = {
                            address:
                              "19B Fola Osibo, Lekki Phase 1, Lekki, Nigeria",
                            latitude: 6.430118879280349,
                            longitude: 3.4881381695005618,
                          };
                        } else if (selected === "2") {
                          pickupLoc = {
                            address:
                              "13b Methodist Church St, Opebi, Lagos 101233, Lagos, Nigeria",
                            latitude: 6.5244,
                            longitude: 3.3792,
                          };
                        }
                        this.setState({
                          selectedPickup: selected,
                          pickupLocation: pickupLoc,
                        });
                      }}
                      options={[
                        {
                          key: "",
                          label: "Choose pickup location",
                        },
                        {
                          key: "1",
                          label:
                            "19B Fola Osibo, Lekki Phase 1, Lekki, Nigeria",
                        },
                        {
                          key: "2",
                          label:
                            "13b Methodist Church St, Opebi, Lagos 101233, Lagos, Nigeria",
                        },
                      ]}
                    />
                  </div>
                  <div className="input-container mb-40">
                    <label>
                      Pickup Date <sup className="marked">*</sup>
                    </label>
                    <DayPickerInput
                      dayPickerProps={disabledModifiers}
                      value={deliveryDate.value}
                      onDayChange={this.handleDeliveryDateChange}
                      placeholder="DD/MM/YYYY"
                      format="DD/MM/YYYY"
                    />
                  </div>
                </>
              ) : null}
              <TextField
                label="Special Note"
                placeholder="Any special notes for delivery"
                name="note"
                value={note.value}
                onChange={this.handleChange}
                className="mb-40"
              />
            </div>
          </div>
        </div>
        <div className="cart-actions no-margin fixed">
          {deliveryCost >= 0 &&
            (shippingMethod.value === "delivery" ||
              shippingMethod.value === "s-delivery") && (
              <div className="delivery-fees-notice">
                <div className="container">
                  <span className="icon">
                    <img src="/static/images/delivery.png" alt="" />
                  </span>
                  <span className="text">
                    {this.props.deliveryDiscountObject?.id &&
                    this.state.chosenCity?.price ? (
                      <>
                        <strike>
                          ₦{this.state.chosenCity?.price.toLocaleString()}
                        </strike>
                        &nbsp;
                        {this.state.chosenCity?.price <= 3000 &&
                          `₦${this.props.deliveryDiscountObject?.price.toLocaleString()}`}
                        {this.state.chosenCity?.price > 3000 &&
                          `Shipping discount applied. Fee reduced to ₦${(
                            this.state.chosenCity?.price - 3000
                          ).toLocaleString()}`}
                      </>
                    ) : (
                      `₦${deliveryCost.toLocaleString()} will be charged for delivery`
                    )}
                    {(!this.props.deliveryDiscountObject?.id ||
                      (this.props.deliveryDiscountObject?.id &&
                        this.state.chosenCity?.price <= 3000)) && (
                      <>&nbsp;will be charged for delivery</>
                    )}
                  </span>
                </div>
              </div>
            )}

          {/* Checkout Buton */}
          {deliveryArr.includes(shippingMethod?.value) ? (
            <div
              className={classNames("checkout-button", {
                disabled:
                  !this.state.priceCheck ||
                  !this.checkFormValidity() ||
                  isCheckingOut ||
                  isLoadingDeliveryPrice ||
                  Object.entries(this.state.chosenCity).length === 0
                    ? true
                    : false,
              })}
              onClick={this.checkout}
            >
              <div className="container">
                <span>
                  {/* {isCheckingOut ? "Sending..." : "Send Order to Whatsapp"} ₦ */}
                  {isCheckingOut ? "Paying..." : "Pay"} ₦
                  {finalAmount.toLocaleString()}
                  {discountAmount ? (
                    <small style={{ marginLeft: "10px" }}>
                      <strike>
                        ₦{(subTotal + deliveryCost).toLocaleString()}
                      </strike>
                    </small>
                  ) : null}
                </span>
                <RightArrow />
              </div>
            </div>
          ) : (
            <div
              className={classNames("checkout-button", {
                disabled:
                  !this.state.priceCheck ||
                  !this.checkFormValidity() ||
                  isCheckingOut ||
                  isLoadingDeliveryPrice ||
                  ((shippingMethod.value === "pickup" ||
                    shippingMethod.value === "s-pickup") &&
                    this.state.selectedPickup === ""),
              })}
              onClick={this.checkout}
            >
              <div className="container">
                <span>
                  {isCheckingOut ? "Paying..." : "Pay"} ₦
                  {/* {isCheckingOut ? "Sending..." : "Send order to Whatsapp"} ₦ */}
                  {finalAmount.toLocaleString()}
                  {discountAmount ? (
                    <small style={{ marginLeft: "10px" }}>
                      <strike>
                        {(subTotal + deliveryCost).toLocaleString()}
                      </strike>
                    </small>
                  ) : null}
                </span>
                <RightArrow />
              </div>
            </div>
          )}

          {/* Checkout Buton */}

          {/* Checkout Buton */}
          {/* <div
            className={classNames("checkout-button", {
              disabled:
                !this.state.priceCheck ||
                !this.checkFormValidity() ||
                isCheckingOut ||
                isLoadingDeliveryPrice,
            })}
            onClick={this.checkout}
          >
            <div className="container">
              <span>
                {isCheckingOut ? "Paying..." : "Pay"} ₦
                {(
                  subTotal +
                  deliveryCost -
                  (discountAmount || 0)
                ).toLocaleString()}
                {discountAmount && (
                  <small style={{ marginLeft: "10px" }}>
                    <strike>
                      {(subTotal + deliveryCost).toLocaleString()}
                    </strike>
                  </small>
                )}
              </span>
              <RightArrow />
            </div>
          </div> */}
          {/* Checkout Buton */}
        </div>

        {toaster && <Toaster {...toaster} closeToaster={this.closeToaster} />}
      </div>
    );
  }
}

export default StoreConsumer(CartConsumer(AuthenticationConsumer(Checkout)));
