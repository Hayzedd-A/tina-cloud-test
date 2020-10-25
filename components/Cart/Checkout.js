import { Component } from "react";
import Geosuggest from "react-geosuggest";
import * as classNames from "classnames";

import { CartConsumer } from "../../providers/CartProvider";

import { TextField } from "../FormElements";
import Toaster from "../Toaster";

import { postRequest } from "../../api";
import { RightArrow } from "../../public/static/vectors";
import {
  reduceArray,
  getFormValues,
  getRequestError,
  paystack
} from "../../utils/functions";
import { deliveryPoints } from "../../utils/data";

class Checkout extends Component {
  state = {
    formData: {
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
      }
    },
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
        url: "/placed-orders",
        data: {
          orderItems,
          customer: {
            name,
            phoneNumber,
            address,
            storeId: "ba629b0f-9749-4097-bfc7-825fdcfe6811"
          }
        }
      });

      const { paymentReference, amount } = res.data;

      console.log(email);
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
    const { clearCart } = this.props;
    clearCart();
    this.openToaster(
      "success",
      `Your order (${response.reference}) has been received and is being processed. Kindly check your email for more details`
    );
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

  render() {
    const { toaster, deliveryCost, isCheckingOut } = this.state;
    const { cart, goBack } = this.props;

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
            <TextField
              label="Receiver Name"
              placeholder="Enter your name"
              name="name"
              onChange={(e, valid) => this.handleChange(e, valid)}
              className="mb-40"
              required
            />
            <TextField
              label="Email Address"
              placeholder="Enter your email address"
              type="email"
              name="email"
              onChange={(e, valid) => this.handleChange(e, valid)}
              className="mb-40"
              required
            />
            <TextField
              label="Phone Number"
              placeholder="Enter your phone number"
              name="phoneNumber"
              onChange={(e, valid) => this.handleChange(e, valid)}
              className="mb-40"
              required
            />
            <div className="input-container">
              <label>Delivery Address</label>
              <Geosuggest
                className="mb-40"
                placeholder="Enter your address"
                country="ng"
                onSuggestSelect={this.onSuggestSelect}
                onSuggestNoResults={this.onSuggestNoResults}
                queryDelay={600}
              />
            </div>
            <TextField
              label="Delivery Note (Optional)"
              placeholder="Any special notes for delivery"
              name="note"
              onChange={(e, valid) => this.handleChange(e, valid)}
              className="mb-40"
            />
          </div>
        </div>
        <div className="cart-actions">
          {!!deliveryCost && (
            <div className="delivery-fees-notice">
              <div className="container">
                <span className="icon">
                  <img src="/static/images/delivery.png" alt="" />
                </span>
                <span className="text">
                  ₦{deliveryCost.toLocaleString()} will be charged for delivery!
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

export default CartConsumer(Checkout);
