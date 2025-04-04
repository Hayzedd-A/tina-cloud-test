import { Component, Fragment, useEffect } from "react";
import Geosuggest from "react-geosuggest";
import * as classNames from "classnames";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";

import { AuthenticationConsumer } from "../../providers/AuthenticationProvider";
import { CartConsumer } from "../../providers/CartProvider";
import { StoreConsumer } from "../../providers/StoreProvider";

import { TextField } from "../FormElements";
import Toaster from "../Toaster";

import { postRequest, getRequest } from "../../api";
import { RightArrow } from "../../public/static/vectors";
import {
  reduceArray,
  getFormValues,
  getRequestError,
  paystack,
  patchFormValues,
  dynamicSort,
} from "../../utils/functions";

import { deliveryPoints } from "../../utils/data";
import { HeaderMenu } from "../Header";
import { API_BASE_URL, STORE_ID } from "../../constants";
import SelectField from "../FormElements/SelectField";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { SearchOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import Axios from "axios";

const deliveryArr = ["delivery", "s-delivery"];

const initialFormData = {
  name: {
    value: "",
    valid: false,
  },
  phoneNumber: {
    value: "",
    valid: false,
  },
  deliveryDiscountCode: {
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
    formData: { ...initialFormData },
    deliveryCost: 0,
    discountDeliveryType: null,
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
    deliveryLocation: {
      address: "",
      latitude: "",
      longitude: "",
    },
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
    if (target.name === "deliveryDiscountCode") {
      debugger;
    }
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
      discountDeliveryType:
        target.name === "deliveryDiscountCode"
          ? null
          : this.state.discountDeliveryType,
      deliveryCost:
        target.name === "shippingMethod"
          ? 0
          : target.name === "deliveryDiscountCode"
          ? parseInt(this.state.chosenCity?.price)
          : this.state.deliveryCost,
    });
    1;
  };

  handleDeliveryChange = ({ target }, valid) => {
    const { value } = target;
    this.resetDelivery(value);

    if (deliveryArr.includes(value)) {
      const { store } = this.props;
      if (store?.states.length < 1) {
        this.openToaster(
          "error",
          "The delivery system for this store is not availabale yet"
        );
      } else {
        this.effectDeliveryChange(value);
      }
    } else {
      this.effectDeliveryChange(value);
    }
  };

  effectDeliveryChange = (value) => {
    this.setState({
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
      // deliveryCost:
      //   value === "pickup" || value === "s-pickup"
      //     ? 0
      //     : this.state.deliveryCost,
    });
  };

  resetDelivery = (value) => {
    debugger;
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
        deliveryDiscountCode: {
          value: "",
          valid: true,
        },
      },
      deliveryCost: 0,
      discountDeliveryType: null,
      chosenState: "lagos",
      chosenCity: {},
      touched: false,
      cities: [...this.state.storeCities],
      deliveryLocation: {
        address: "",
        latitude: "6.5244",
        longitude: "3.3792",
      },
      initialValue: "",
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

    return Object.values(rest).every(
      (value) =>
        value.valid &&
        (rest.shippingMethod.value === "delivery" ||
        rest.shippingMethod.value === "s-delivery"
          ? address.valid
          : true)
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
          const address = suggest.gmaps.formatted_address;
          const fullAddress = suggest.label;
          const latitude = suggest.location.lat;
          const longitude = suggest.location.lng;

          const { store } = this.props;
          const { id: STORE_ID } = store || {};
          this.setState({
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
            deliveryCost:
              Object.keys(this.state.chosenCity).length > 0
                ? parseInt(this.state.chosenCity?.price)
                : 0,
            isLoadingDeliveryPrice: false,
          });
        }
      }
    );
  };

  onSuggestChange = async (suggest) => {
    if (suggest && suggest.length > 0) {
      this.setState({
        discountDeliveryType: null,
        formData: {
          ...this.state.formData,
          deliveryDiscountCode: {
            value: "",
            valid: true,
          },
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
        deliveryCost:
          Object.keys(this.state.chosenCity).length > 0
            ? parseInt(this.state.chosenCity?.price)
            : 0,
        isLoadingDeliveryPrice: false,
      });
    } else {
      this.setState({
        discountDeliveryType: null,
        formData: {
          ...this.state.formData,
          deliveryDiscountCode: {
            value: "",
            valid: true,
          },
          address: {
            value: "",
            valid: false,
          },
        },
        deliveryCost: 0,
        isLoadingDeliveryPrice: true,
      });
    }
  };

  onSuggestNoResults = (userInput) => {};

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
      discountDeliveryType,
    } = this.state;
    const {
      name,
      phoneNumber,
      deliveryDiscountCode,
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
      loyaltyPointApplied,
      loyaltyPointsAvailable,
    } = this.props;

    const orderItems = cart.map(({ id, quantity, toppings }) => ({
      productId: id,
      quantity,
      toppings: toppings.map((topping) => ({
        productId: topping.id,
        quantity: topping.quantity || 1,
      })),
    }));

    this.setState({
      isCheckingOut: true,
    });

    const payload = {
      state: "lagos",
      city: chosenCity?.label,
      deliveryTypeId: discountDeliveryType?.id || chosenCity?.key,
      originalDeliveryTypeId: chosenCity?.key,
      specialNote: note,
      orderItems,
      customer: {
        name,
        phoneNumber,
        address,
        email,
      },
      recipient: {
        name,
        phoneNumber,
      },
      deliveryDate: deliveryDate || null,
      deliveryLocation,
    };

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
      //If loyaltyPoints are applied and a gift card is also applied then this if condition

      let loyaltyPointsToRedeem = parseFloat(loyaltyPointApplied.value);

      /*
      Below condition checks:
      
      if giftCardDiscount is applied AND giftCardDiscount is not covering the total order amount
      AND ALSO
      if loyaltyDiscount is being redeemed, then check does (giftCardDiscount + loyaltyDiscount) covers the total amount or not
      if it covers the total amount then check that on top of giftCardDiscount, how many loyalty points can be redeemed before the order is covered completely
      FOR EXAMPLE:
      totalOrderAmount = 10k
      giftCardDiscount = 9.5k
      loyaltyDiscount = 1k

      So if we redeem the discount and also apply the gift card, it will exceed the order amount, instead we will deduct only enough discount that can cover the order amount so in above scenario:

      totalOrderAmount = 10k
      giftCardDiscount = 9.5k
      loyaltyDiscount = 0.5k (out of 1k total, we are only redeeming .5k so that rest of the .5k can be redeemed later if customer wants to)
      */
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

    shippingMethod === "pickup" && delete payload.deliveryLocation;
    shippingMethod === "s-pickup" && delete payload.deliveryLocation;

    try {
      const res = await postRequest({
        url: `/customer-requests/stores/8a7a28dc-b54d-4841-b949-efe60dbae709/placed-orders`,
        data: payload,
      });

      const { paymentReference, amount } = res.data;

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
        storeID: "8a7a28dc-b54d-4841-b949-efe60dbae709",
      };

      let finalAmount = subTotal + deliveryCost - discountAmount;

      if (finalAmount <= 0) finalAmount = 0;

      paystack(
        email,
        paymentReference,
        parseFloat(finalAmount == 0 ? 0.01 : finalAmount) * 100,
        this.handlePaystackSuccess,
        this.handlePaystackClose,
        metadata
      );

      this.setState({
        isCheckingOut: false,
      });
    } catch (error) {
      const message = getRequestError(error);

      this.setState({
        isCheckingOut: false,
      });

      this.openToaster("error", message);
    }
  };

  handlePaystackSuccess = (response) => {
    const { clearCart, showCheckoutSuccess } = this.props;
    clearCart();
    showCheckoutSuccess(true);
  };

  handlePaystackClose = () => {
    console.log("paystack closed");
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

    // if (currentStore && currentStore?.address === null) {
    //   this.openToaster(
    //     "error",
    //     "Store Address is not available,please try out other stores"
    //   );
    //   setTimeout(() => {
    //     const { store: storeUrl } = this.props?.router?.query || {};
    //     this.props?.router.push(`/${storeUrl}`, undefined, {
    //       shallow: true,
    //     });
    //   }, 2000);
    // }

    // this.setState({
    //   pickUpAddress: {
    //     ...currentStore?.gokadaAddress,
    //   },
    // });

    // // Check if pickup is enabled and address set for pickup option
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
    if (currentStore?.delivery_types.length > 0) {
      let newStateArr = [];

      currentStore &&
        currentStore.delivery_types.sort(dynamicSort("name")).map((item) => {
          let newObj = {};
          newObj.key = item.id;
          newObj.label = `${this.capitalizeWord(
            item.name.toLowerCase()
          )} - (N${item.price.toLocaleString()})`;
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
        "Delivery not availabale in this state yet, you can choose PICKUP or SCHEDULED delivery"
      );
    }
  };

  componentDidUpdate(_, prevState) {
    const { deliveryCost } = this.state;
    const subTotal = reduceArray(this.props.cart, "totalCost");
    const discountEligible = subTotal >= 25000 && deliveryCost <= 3000;

    if (!discountEligible && this.state.discountDeliveryType !== null) {
      debugger;
      this.setState({ discountDeliveryType: null });
    }
  }

  handleCityChange = (e) => {
    let cityIndex = e.target.value;
    if (isNaN(e)) {
      let index = e.target.value;
      if (!isNaN(index)) {
        this.openToaster("error", "Please choose a valid delivery option");
        this.setState({
          formData: {
            ...this.state.formData,
            deliveryDiscountCode: {
              value: "",
              valid: true,
            },
          },
          chosenCity: {},
          deliveryCost: 0,
          discountDeliveryType: null,
        });
      } else {
        let found = this.state.cities.find((elem) => {
          return elem.key === index;
        });
        if (found) {
          if (Object.entries(found).length > 0) {
            this.setState({
              formData: {
                ...this.state.formData,
                deliveryDiscountCode: {
                  value: "",
                  valid: true,
                },
              },
              chosenCity: { ...found },
              deliveryCost: parseInt(found.price),
              discountDeliveryType: null,
            });
          }
        }
      }
    } else {
      this.setState({
        formData: {
          ...this.state.formData,
          deliveryDiscountCode: {
            value: "",
            valid: true,
          },
        },
        chosenCity: {},
        deliveryCost: 0,
        discountDeliveryType: null,
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
    } = this.state;
    const { cart, goBack, couponObject, giftCardObject, loyaltyPointApplied } =
      this.props;
    const {
      name,
      phoneNumber,
      email,
      shippingMethod,
      note,
      deliveryDate,
      deliveryDiscountCode,
    } = formData;

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

    const loyaltyDiscountApplied = parseFloat(loyaltyPointApplied.value || 0);

    const ttlGcDiscount = giftCardObject?.remainingValue || 0;

    let discountAmount = couponObject
      ? couponObject.discountType === "percent"
        ? (couponObject.value * subTotal) / 100
        : couponObject.value
      : null;

    if (loyaltyDiscountApplied)
      discountAmount = (discountAmount || 0) + loyaltyDiscountApplied;

    if (ttlGcDiscount) discountAmount = (discountAmount || 0) + ttlGcDiscount;

    let finalAmount = subTotal + deliveryCost - discountAmount;

    let finalAmountWithoutDeliveryFee = subTotal - discountAmount;

    const allowDeliveryDiscount = (ttlWithoutDelivFee, delivFee) => {
      return ttlWithoutDelivFee >= 25000 && delivFee <= 3000;
    };

    if (discountAmount > subTotal + deliveryCost) finalAmount = 0;

    const searchDeliveryDiscountCode = async (_) => {
      const data = await Axios.post(
        `${API_BASE_URL}auth/verify-delivery-discount-code`,
        {
          deliveryDiscountCode: deliveryDiscountCode.value,
        }
      ).catch((e) => {});
      if (data?.status == 200) {
        this.setState({
          ...this.state,
          discountDeliveryType: data.data.message,
          deliveryCost: data.data.message.price,
        });
        message.success("Delivery discount applied");
      } else {
        this.setState({
          ...this.state,
          discountDeliveryType: null,
          deliveryCost: parseInt(this.state.chosenCity?.price) || 0,
        });
        message.error("Invalid delivery discount");
      }
    };

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
              <span className="text">Well done! You’re almost there</span>
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
                Minimum item price for checkout is #2500
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
                  {
                    key: "pickup",
                    label: "Pickup",
                  },
                  {
                    key: "s-delivery",
                    label: "Scheduled Delivery",
                  },
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
                      initialValue={initialValue}
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
                  {this.state.chosenCity?.price &&
                    allowDeliveryDiscount(
                      finalAmountWithoutDeliveryFee,
                      deliveryCost
                    ) && (
                      <div style={{ display: "flex" }} className="mb-40">
                        <TextField
                          label="Delivery discount code"
                          placeholder="Enter the delivery discount code"
                          name="deliveryDiscountCode"
                          value={deliveryDiscountCode.value}
                          onChange={this.handleChange}
                          style={{
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                          }}
                        />
                        <Button
                          type="primary"
                          onClick={searchDeliveryDiscountCode}
                          style={{
                            marginTop: 33,
                            height: 62,
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                          }}
                        >
                          <SearchOutlined />
                        </Button>
                      </div>
                    )}
                </Fragment>
              ) : shippingMethod.value === "pickup" ? (
                <div className="input-container mb-40">
                  <label>Pickup Address</label>
                  <div className="pickup-address mb-40">
                    19B Fola Osibo, Lekki Phase 1, Lekki, Nigeria
                  </div>
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
                    <label>Pickup Address</label>
                    <div className="pickup-address mb-40">
                      19B Fola Osibo, Lekki Phase 1, Lekki, Nigeria
                    </div>
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
                    {this.state.discountDeliveryType?.id ? (
                      <>
                        <strike>
                          ₦{this.state.chosenCity?.price.toLocaleString()}
                        </strike>
                        &nbsp;₦
                        {this.state.discountDeliveryType?.price.toLocaleString()}
                      </>
                    ) : (
                      `₦${deliveryCost.toLocaleString()}`
                    )}
                    &nbsp;will be charged for delivery{" "}
                    {/* {this.state.discountDeliveryType?.price > 0
                      ? ` (Balance of amount can be made during payment confirmation)`
                      : ``} */}
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
                  {isCheckingOut ? "Paying..." : "Pay"} ₦
                  {finalAmount.toLocaleString()}
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
            </div>
          ) : (
            <div
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
                  {finalAmount.toLocaleString()}
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
