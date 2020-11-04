import { Component } from "react";
import classNames from "classnames";
import Link from "next/link";
import { withRouter } from "next/router";

import Main from "../layouts/Main";

import { TextField, Pin } from "../components/FormElements";
import Toaster from "../components/Toaster";

import { AuthenticationConsumer } from "../providers/AuthenticationProvider";

import { RightArrow } from "../public/static/vectors";
import { getFormValues } from "../utils/functions";

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

  login = () => {
    const { login, router } = this.props;
    const { phoneNumber, pin } = getFormValues(this.state.formData);

    login({ phoneNumber, pin }, () => router.push("/my-account"));
  };

  componentDidMount() {
    const currentUser = localStorage.getItem("gourmet-twist-user");

    currentUser && this.props.router.push("/my-account")
  }

  render() {
    const { toaster } = this.state;
    const { isLoggingIn } = this.props;

    return (
      <Main>
        <div className="cart-container login-container">
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
              <div className="cart-actions">
                <div
                  className={classNames("checkout-button", {
                    disabled: !this.checkFormValidity() || isLoggingIn
                  })}
                  onClick={this.login}
                >
                  <div className="container">
                    <span>Create Pin</span>
                    <RightArrow />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {toaster && <Toaster {...toaster} closeToaster={this.closeToaster} />}
        </div>
      </Main>
    );
  }
}

export default withRouter(AuthenticationConsumer(CreateLogin));
