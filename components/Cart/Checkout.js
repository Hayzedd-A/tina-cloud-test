import { Component } from "react";
import Geosuggest from "react-geosuggest";
import * as classNames from "classnames";

import { AuthenticationConsumer } from "../../providers/AuthenticationProvider";
import { CartConsumer } from "../../providers/CartProvider";

import { TextField, Radio } from "../FormElements";
import Toaster from "../Toaster";

import { postRequest } from "../../api";
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
    valid: false
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
        }
      }
    });
  };

  checkFormValidity = () => {
    return Object.values(this.state.formData).every(value => value.valid);
  };

  onSuggestSelect = suggest => {
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
        deliveryCost: 0
      },
      () => {
        if (suggest) {
          const deliveryArray = deliveryPoints.map(({ price, lat, lon }) => {
            const distance = this.computeDistance(suggest, { lat, lon });

            return {
              price,
              distance
            };
          });

          const nearest = deliveryArray.reduce(
            (min, p) => (p.distance < min.distance ? p : min),
            deliveryArray[0]
          );

          console.log(nearest);

          this.setState({
            formData: {
              ...this.state.formData,
              address: {
                value: suggest.gmaps.formatted_address,
                valid: true
              }
            },
            deliveryCost: parseInt(nearest.price)
          });
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
    const { formData, deliveryCost } = this.state;
    const { name, phoneNumber, address, email } = getFormValues(formData);
    const { cart } = this.props;

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

    try {
      const res = await postRequest({
        url:
          "/customer-requests/stores/ba629b0f-9749-4097-bfc7-825fdcfe6811/placed-orders",
        data: {
          orderItems,
          customer: {
            name,
            phoneNumber,
            address
          }
        }
      });

      const { paymentReference, amount } = res.data;

      paystack(
        email,
        paymentReference,
        (parseFloat(amount) + parseFloat(deliveryCost)) * 100,
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
          }
        }
      });
    }
  }

  render() {
    const { toaster, deliveryCost, isCheckingOut, formData } = this.state;
    const { cart, goBack } = this.props;
    const { name, phoneNumber, email, shippingMethod, note } = formData;

    const subTotal = reduceArray(cart, "totalCost");

    return (
      <div className="cart-container">
        <div className="cart-header">
          <div className="back" onClick={goBack}>
            <RightArrow />
          </div>
          <div className="title">Checkout</div>
          <div className="info">
            <span className="icon checkout-icon">
              <img src="/static/images/star.png" alt="" />
            </span>
            <span className="text">Well done! You’re almost there</span>
          </div>
        </div>
        <div className="checkout-form">
          <div className="container">
            <div className="description">All fields are compulsory</div>
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
                  onChange={this.handleChange}
                  checked={shippingMethod.value === "delivery"}
                />
                <Radio
                  label="Pickup"
                  name="shippingMethod"
                  value="pickup"
                  onChange={this.handleChange}
                  checked={shippingMethod.value === "pickup"}
                />
              </div>
              {shippingMethod.value === "delivery" ? (
                <div className="input-container mb-40">
                  <label>Delivery Address</label>
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
                <TextField
                  label="Pickup Address"
                  value="123 Brown St."
                  disabled
                  className="mb-40"
                />
              )}
              <TextField
                label="Special Note"
                placeholder="Any special notes for delivery"
                name="note"
                value={note.value}
                onChange={this.handleChange}
                className="mb-40"
                required
              />
            </div>
          </div>
        </div>
        <div className="cart-actions no-margin">
          {!!deliveryCost && (
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
              disabled: !this.checkFormValidity() || isCheckingOut
            })}
            onClick={this.checkout}
          >
            <div className="container">
              <span>Pay ₦{(subTotal + deliveryCost).toLocaleString()}</span>
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
