import { Component } from "react";
import Geosuggest from "react-geosuggest";
import * as classNames from "classnames";

import { AuthenticationConsumer } from "../../providers/AuthenticationProvider";
import { CartConsumer } from "../../providers/CartProvider";

import { TextField, Radio } from "../FormElements";
import Toaster from "../Toaster";

import { postRequest, getRequest } from "../../api";
import { RightArrow } from "../../public/static/vectors";
import {
  reduceArray,
  getFormValues,
  getRequestError,
  paystack,
  patchFormValues
} from "../../utils/functions";
import { deliveryPoints } from "../../utils/data";

const initialFormData = {
  name: {
    value: "",
    valid: false
  },
  phoneNumber: {
    value: "",
    valid: false
  },
  email: {
    value: "",
    valid: false
  },
  address: {
    value: "",
    valid: false
  },
  note: {
    value: "",
    valid: true
  },
  shippingMethod: {
    value: "delivery",
    valid: true
  }
};

class Checkout extends Component {
  state = {
    formData: { ...initialFormData },
    deliveryCost: 0
  };

  handleChange = ({ target }, valid) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [target.name]: {
          value: target.value,
          valid
        },
        address:
          target.name === "shippingMethod"
            ? {
              value: "",
              valid: false
            }
            : this.state.formData.address
      },
      deliveryCost:
        target.name === "shippingMethod" ? 0 : this.state.deliveryCost
    });
  };

  checkFormValidity = () => {
    const { address, ...rest } = this.state.formData;

    return Object.values(rest).every(
      value =>
        value.valid &&
        (rest.shippingMethod.value === "delivery" ? address.valid : true)
    );
  };

  onSuggestSelect = async suggest => {
    console.log(suggest);
    this.setState(
      {
        formData: {
          ...this.state.formData,
          address: {
            value: "",
            valid: false
          }
        },
        deliveryCost: 0,
        isLoadingDeliveryPrice: true
      },
      async () => {
        if (suggest) {

          const address = suggest.gmaps.formatted_address;
          const latitude = suggest.location.lat;
          const longitude = suggest.location.lng;

          try {
            const res = await getRequest({
              url:
                "/customer-requests/stores/8a7a28dc-b54d-4841-b949-efe60dbae709/get-delivery-type",
              params: {
                address,
                latitude,
                longitude
              }
            });

            this.setState({
              formData: {
                ...this.state.formData,
                address: {
                  value: address,
                  valid: true
                }
              },
              deliveryLocation: {
                address,
                latitude,
                longitude
              },
              deliveryCost: parseInt(res.data.price),
              isLoadingDeliveryPrice: false
            });
          } catch (error) {
            const errorMessage = error && error.response && error.response.data && error.response.data.message ? error.response.data.message : "An error occured while fetching delivery price, please enter again";

            this.openToaster(
              "error",
              errorMessage
            );

            this.setState({
              isLoadingDeliveryPrice: false
            });
          }
        }
      }
    );
  };

  onSuggestNoResults = userInput => {
    console.log("no results for " + userInput);
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
    const { formData, deliveryCost, deliveryLocation } = this.state;
    const { name, phoneNumber, address, email, shippingMethod } = getFormValues(
      formData
    );
    const { cart, user } = this.props;

    const orderItems = cart.map(({ id, quantity, toppings }) => ({
      productId: id,
      quantity,
      toppings: toppings.map(topping => ({
        productId: topping.id,
        quantity: topping.quantity || 1
      }))
    }));

    this.setState({
      isCheckingOut: true
    });

    const payload = {
      orderItems,
      customer: {
        name,
        phoneNumber,
        address
      },
      recipient: {
        name,
        phoneNumber
      },
      deliveryLocation
    };

    shippingMethod === "pickup" && delete payload.deliveryLocation;

    try {
      const res = await postRequest({
        url:
          "/customer-requests/stores/8a7a28dc-b54d-4841-b949-efe60dbae709/placed-orders",
        data: payload
      });

      const { paymentReference, amount } = res.data;

      paystack(
        email,
        paymentReference,
        (parseFloat(amount)) * 100,
        this.handlePaystackSuccess,
        this.handlePaystackClose
      );

      this.setState({
        isCheckingOut: false
      });
    } catch (error) {
      console.log(error);
      const message = getRequestError(error);

      this.setState({
        isCheckingOut: false
      });

      this.openToaster("error", message);
    }
  };

  handlePaystackSuccess = response => {
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
        message
      }
    });
  };

  closeToaster = () => {
    this.setState({
      toaster: null
    });
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    const currentUser = localStorage.getItem("gourmet-twist-user");

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
            valid: true
          },
          address: {
            value: "",
            valid: false
          }
        }
      });
    }
  }

  render() {
    const {
      toaster,
      deliveryCost,
      isCheckingOut,
      formData,
      isLoadingDeliveryPrice
    } = this.state;
    const { cart, goBack } = this.props;
    const { name, phoneNumber, email, shippingMethod, note } = formData;

    const subTotal = reduceArray(cart, "totalCost");

    return (
      <div className="cart-container">
        <div className="cart-header">
          <div className="container login-header-inner" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="back" onClick={goBack}>
              <RightArrow />
            </div>
            <div className="title">Checkout</div>
          </div>
          <div className="info">
            <span className="icon checkout-icon">
              <img src="/static/images/star.png" alt="" />
            </span>
            <span className="text">Well done! You’re almost there</span>
          </div>
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
              required
              mobile
            />
          </div>
          <div className="shipping-method">
            <div className="container">
              <div className="radio-group mb-40">
                <Radio
                  label="Delivery"
                  name="shippingMethod"
                  value="delivery"
                  onChange={e => this.handleChange(e, !!e.target.value)}
                  checked={shippingMethod.value === "delivery"}
                />
                <Radio
                  label="Pickup"
                  name="shippingMethod"
                  value="pickup"
                  onChange={e => this.handleChange(e, !!e.target.value)}
                  checked={shippingMethod.value === "pickup"}
                />
              </div>
              {shippingMethod.value === "delivery" ? (
                <div className="input-container mb-40">
                  <label>
                    Delivery Address <sup className="marked">*</sup>
                    {isLoadingDeliveryPrice && <i style={{ textTransform: 'capitalize', color: '#333', fontWeight: 'bold' }}> Calculating Price... </i>}
                  </label>
                  <Geosuggest
                    placeholder="Enter your address"
                    country="ng"
                    onSuggestSelect={this.onSuggestSelect}
                    onSuggestNoResults={this.onSuggestNoResults}
                    queryDelay={600}
                  />
                  <span className="hint">
                    {" "}
                    If your delivery address is not auto-detected, enter your
                    city
                  </span>
                </div>
              ) : (
                  <div className="input-container mb-40">
                    <label>Pickup Address</label>
                    <div className="pickup-address mb-40">
                      RT Lawal Street, Behind Meadow Hall School, Ikate
                  </div>
                  </div>
                )}
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
          {!!deliveryCost && shippingMethod.value === "delivery" && (
            <div className="delivery-fees-notice">
              <div className="container">
                <span className="icon">
                  <img src="/static/images/delivery.png" alt="" />
                </span>
                <span className="text">
                  ₦{deliveryCost.toLocaleString()} will be charged for delivery
                </span>
              </div>
            </div>
          )}
          <div
            className={classNames("checkout-button", {
              disabled:
                !this.checkFormValidity() ||
                isCheckingOut ||
                isLoadingDeliveryPrice
            })}
            onClick={this.checkout}
          >
            <div className="container">
              <span>{isCheckingOut ? 'Paying...' : 'Pay'} ₦{(subTotal + deliveryCost).toLocaleString()}</span>
              <RightArrow />
            </div>
          </div>
        </div>

        {toaster && <Toaster {...toaster} closeToaster={this.closeToaster} />}
      </div>
    );
  }
}

export default CartConsumer(AuthenticationConsumer(Checkout));
