import { Component } from "react";
import classNames from "classnames";
import { withRouter } from "next/router";
import shallowequal from "shallowequal";

import Main from "../layouts/Main";

import { TextField, Pin } from "../components/FormElements";
import Toaster from "../components/Toaster";
import Tabs from "../components/Tabs";

import axios from "axios";

import { AuthenticationConsumer } from "../providers/AuthenticationProvider";

import { RightArrow } from "../public/static/vectors";
import { getFormValues } from "../utils/functions";
import { API_BASE_URL, STORE_ID } from "../constants";
import { Button, message } from "antd";

class CreateLogin extends Component {
  constructor(props) {
    super(props);

    const { router } = props;
    const { newUser } = router.query;

    this.state = {
      formData: {
        phoneNumber: {
          value: "",
          valid: false,
        },
        pin: {
          value: "",
          valid: false,
        },
        confirmPin: {
          value: "",
          valid: false,
        },
        referredBy: {
          value: "",
          valid: true,
        },
      },
      pinResetLayout: false,
      sendingPinResetCode: false,
      currentTab: newUser ? 1 : 0,
      isTabActive: false,
      isSignUp: !!newUser,
    };
  }

  resetPin = () => {
    this.setState({
      ...this.state.formData,
      pinResetLayout: true,
    });
  };

  sendResetPinCode = async () => {
    this.setState({
      ...this.state.formData,
      sendingPinResetCode: true,
    });
    const { phoneNumber } = getFormValues(this.state.formData);
    if (phoneNumber.length < 10)
      return message.warning("Please provide valid phone number");

    try {
      const response = await axios.post(`${API_BASE_URL}customers/reset-pin`, {
        storeId: STORE_ID,
        phoneNumber, // use the form value
      });
      message.success("Reset code sent successfully");
    } catch (error) {
      const status = error.response ? error.response.status : "Unknown";
      if (status === 300)
        message.warning(
          "Message is already sent. Please wait till you receive the message",
        );
      else if (status === 404) message.warning("Phone number does not exist");
    }
    this.setState({
      ...this.state.formData,
      pinResetLayout: false,
      sendingPinResetCode: false,
    });
  };

  handleChange = ({ target }, valid) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [target.name]: {
          value:
            target.name === "referredBy"
              ? target.value.toUpperCase()
              : target.value,
          valid,
        },
      },
    });
  };

  switchTab = (currentTab) => {
    this.setState({
      currentTab,
      isSignUp: !!currentTab,
    });
  };

  checkFormValidity = () => {
    const { formData, isSignUp } = this.state;
    const { router } = this.props;
    const { phoneNumber, pin, confirmPin } = formData;

    const data = isSignUp ? formData : { phoneNumber, pin };

    console.log(`***********`);
    console.log(`***********`);
    console.log(`***********`);

    return Object.values(data).every(
      (value) =>
        value.valid && (isSignUp ? pin.value === confirmPin.value : true),
    );
  };

  login = () => {
    const { isSignUp } = this.state;
    const { login, register, router } = this.props;
    const { phoneNumber, referredBy, pin } = getFormValues(this.state.formData);

    isSignUp
      ? register(
          { phoneNumber, referredBy, pin, storeId: STORE_ID },
          () => router.push("/my-account"),
          (error) =>
            this.openToaster(
              "error",
              error || `An error occurred. Please try again.`,
            ),
        )
      : login(
          { phoneNumber, pin },
          () => router.push("/my-account"),
          (error) =>
            this.openToaster("error", error || `Invalid login details`),
        );
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

  setTabBg = () => {
    const tab = document
      .getElementById("tab-container-ref")
      .getBoundingClientRect();

    this.setState({
      isTabActive: tab && tab.top <= 0,
    });
  };

  componentDidMount() {
    window.addEventListener("scroll", this.setTabBg);
    const currentUser = localStorage.getItem("gourmet-twist-user");

    currentUser && this.props.router.push("/my-account");
  }

  componentDidUpdate(prevProps) {
    const { router } = this.props;

    if (!shallowequal(prevProps.router, router)) {
      const { newUser } = router.query;

      this.setState({
        currentTab: newUser ? 1 : 0,
        isSignUp: !!newUser,
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.setTabBg);
  }

  render() {
    const {
      currentTab,
      toaster,
      isTabActive,
      isSignUp,
      pinResetLayout,
      sendingPinResetCode,
      formData,
    } = this.state;
    const { isLoggingIn, router } = this.props;

    const { referredBy, phoneNumber, pin, confirmPin } = formData;

    const tabs = ["Login", "Sign up"];

    return (
      <Main>
        <div className="cart-container login-container">
          <div className="cart-header login-header">
            <div
              className="container login-header-inner"
              style={{ position: "relative" }}
            >
              <div
                className="back"
                onClick={() =>
                  router.push(`/`, undefined, {
                    shallow: true,
                  })
                }
              >
                <RightArrow />
              </div>
              <div className="title">My Account</div>
            </div>
          </div>
          <Tabs
            active={isTabActive}
            tabs={tabs}
            currentTab={currentTab}
            switchTab={this.switchTab}
            className="space-between"
          />
          <div className="checkout-form login-form">
            <div className="container">
              <div className="login-form-content">
                <TextField
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  name="phoneNumber"
                  onChange={this.handleChange}
                  value={phoneNumber.value}
                  className="mb-40"
                  required
                  mobile
                />
                {!pinResetLayout && (
                  <Pin
                    label="Enter PIN"
                    name="pin"
                    onChange={this.handleChange}
                    className="mb-40"
                    required
                  />
                )}
                {!isSignUp && (
                  <Button
                    onClick={
                      pinResetLayout ? this.sendResetPinCode : this.resetPin
                    }
                    loading={sendingPinResetCode}
                    disabled={!this.state.formData.phoneNumber}
                  >
                    {pinResetLayout ? "Send Code" : "Forgot Pin"}
                  </Button>
                )}
                {pinResetLayout && (
                  <Button
                    onClick={() => {
                      this.setState({
                        ...this.state.formData,
                        pinResetLayout: false,
                      });
                    }}
                    style={{ marginLeft: 10 }}
                    disabled={sendingPinResetCode}
                  >
                    Cancel
                  </Button>
                )}
                {isSignUp && (
                  <Pin
                    label="Confirm PIN"
                    name="confirmPin"
                    className="mb-40"
                    onChange={this.handleChange}
                    required
                    hint={
                      confirmPin.value &&
                      pin.value !== confirmPin.value && (
                        <span className="hint red">The pins don't match</span>
                      )
                    }
                  />
                )}
                {isSignUp && (
                  <TextField
                    label="Referral Code"
                    placeholder="YXCBE"
                    name="referredBy"
                    max={6}
                    onChange={this.handleChange}
                    value={referredBy.value}
                  />
                )}
              </div>
            </div>
            <div className="cart-actions">
              <div
                className={classNames("checkout-button", {
                  disabled: !this.checkFormValidity() || isLoggingIn,
                })}
                onClick={this.login}
              >
                <div className="container">
                  <span>{isSignUp ? "Create Pin" : "Login"}</span>
                  <RightArrow />
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
