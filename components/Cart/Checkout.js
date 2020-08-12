import { Component } from "react";

import { CartConsumer } from "../../providers/CartProvider";

import { TextField } from "../FormElements";

import { RightArrow } from "../../public/static/vectors";
import { reduceArray } from "../../utils/functions";

class Checkout extends Component {
  state = {
    formData: {
      name: {
        value: "",
        valid: false
      },
      phone: {
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
      }
    }
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

  render() {
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
            />
            <TextField
              label="Email Address"
              placeholder="Enter your email address"
              type="email"
              name="email"
              onChange={(e, valid) => this.handleChange(e, valid)}
              className="mb-40"
            />
            <TextField
              label="Phone Number"
              placeholder="Enter your phone number"
              name="phone"
              onChange={(e, valid) => this.handleChange(e, valid)}
              className="mb-40"
            />
            <TextField
              label="Delivery Address"
              placeholder="Enter your address"
              name="address"
              onChange={(e, valid) => this.handleChange(e, valid)}
              className="mb-40"
            />
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
          <div className="delivery-fees-notice">
            <div className="container">
              <span className="icon">
                <img src="/static/images/delivery.png" alt="" />
              </span>
              <span className="text">₦2,000 will be charged for delivery!</span>
            </div>
          </div>
          <div className="checkout-button">
            <div className="container">
              <span>Pay ₦{(subTotal + 2000).toLocaleString()}</span>
              <RightArrow />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CartConsumer(Checkout);
