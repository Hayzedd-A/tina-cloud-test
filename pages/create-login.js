import { Component } from "react";
import classNames from "classnames";
import Link from "next/link";

import Main from "../layouts/Main";

import { TextField, Pin } from "../components/FormElements";
import Toaster from "../components/Toaster";

import { RightArrow } from "../public/static/vectors";

class CreateLogin extends Component {
  state = {
    formData: {
      phoneNumber: {
        value: "",
        valid: false
      },
      pin: {
        value: "",
        valid: false
      },
      confirmPin: {
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

  checkFormValidity = () => {
    const { formData } = this.state;
    const { pin, confirmPin } = formData;
    return Object.values(formData).every(
      value => value.valid && pin.value === confirmPin.value
    );
  };

  render() {
    const { toaster } = this.state;
    const { isCreatingPin } = this.props;

    return (
      <Main>
        <div className="cart-container">
          <div className="cart-header">
            <Link href="/">
              <a>
                <div className="back">
                  <RightArrow />
                </div>
              </a>
            </Link>
            <div className="title">Create Login</div>
          </div>
          <div className="checkout-form login-form">
            <div className="container">
              <div className="description">
                Create a 4 digit pin for easy sign up
              </div>
              <TextField
                label="Phone Number"
                placeholder="Enter your phone number"
                name="phoneNumber"
                type="phone"
                onChange={this.handleChange}
                className="mb-40"
                required
              />
              <Pin
                label="Enter PIN"
                name="pin"
                onChange={this.handleChange}
                className="mb-40"
                required
              />
              <Pin
                label="Confirm PIN"
                name="confirmPin"
                onChange={this.handleChange}
                required
              />
            </div>
          </div>
          <div className="cart-actions">
            <div
              className={classNames("checkout-button", {
                disabled: !this.checkFormValidity() || isCreatingPin
              })}
              onClick={this.createPin}
            >
              <div className="container">
                <span>Create Pin</span>
                <RightArrow />
              </div>
            </div>
          </div>

          {toaster && <Toaster {...toaster} closeToaster={this.closeToaster} />}
        </div>
      </Main>
    );
  }
}

export default CreateLogin;
