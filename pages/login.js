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
    const { router } = this.props;
    const { newUser } = router.query;
    const { phoneNumber, pin, confirmPin } = formData;

    const data = newUser ? formData : { phoneNumber, pin };

    return Object.values(data).every(
      value => value.valid && (newUser ? pin.value === confirmPin.value : true)
    );
  };

  login = () => {
    const { login, router } = this.props;
    const { phoneNumber, pin } = getFormValues(this.state.formData);

    login({ phoneNumber, pin }, () => router.push("/my-account"));
  };

  componentDidMount() {
    const currentUser = localStorage.getItem("gourmet-twist-user");

    currentUser && this.props.router.push("/my-account");
  }

  render() {
    const { toaster } = this.state;
    const { isLoggingIn, router } = this.props;
    const { newUser } = router.query;

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
            <div className="title">{newUser ? "Create Login" : "Login"}</div>
          </div>
          <div className="checkout-form login-form">
            <div className="container">
              <div className="login-form-content">
                <div className="description">
                  Create a 4 digit pin for easy sign up
                </div>
                <TextField
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  name="phoneNumber"
                  onChange={this.handleChange}
                  className="mb-40"
                  required
                  mobile
                />
                <Pin
                  label="Enter PIN"
                  name="pin"
                  onChange={this.handleChange}
                  className="mb-40"
                  required
                />
                {newUser && (
                  <Pin
                    label="Confirm PIN"
                    name="confirmPin"
                    onChange={this.handleChange}
                    required
                  />
                )}
              </div>
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

export default AuthenticationConsumer(withRouter(CreateLogin));
