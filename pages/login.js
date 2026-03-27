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
        otp: {
          value: "",
          valid: false,
        },
        newPin: {
          value: "",
          valid: false,
        },
        confirmNewPin: {
          value: "",
          valid: false,
        },
        email: {
          value: "",
          valid: false,
        },
      },
      pinResetStage: 0, // 0: Login, 1: Phone Input, 2: OTP, 3: Set PIN
      resetMethod: "whatsapp", // "whatsapp" or "email"
      sendingPinResetCode: false,
      verifyingOtp: false,
      settingPin: false,
      currentTab: newUser ? 1 : 0,
      isTabActive: false,
      isSignUp: !!newUser,
      verificationToken: "",
    };
  }

  resetPin = () => {
    this.setState({
      pinResetStage: 1,
    });
  };

  sendResetPinCode = async () => {
    const { phoneNumber, email } = getFormValues(this.state.formData);
    const { resetMethod } = this.state;

    if (resetMethod === "whatsapp" && (!phoneNumber || phoneNumber.length < 10))
      return message.warning("Please provide valid phone number");

    if (resetMethod === "email" && !this.state.formData.email.valid)
      return message.warning("Please provide valid email");

    this.setState({
      sendingPinResetCode: true,
    });

    try {
      const payload = {
        storeId: STORE_ID,
        method: resetMethod,
      };

      if (resetMethod === "whatsapp") payload.phoneNumber = phoneNumber;
      if (resetMethod === "email") payload.email = email;

      const response = await axios.post(
        `${API_BASE_URL}customers/reset-pin`,
        payload,
      );
      message.success("Reset link sent successfully");
      this.setState({
        pinResetStage: resetMethod === "whatsapp" ? 2 : 0,
      });
    } catch (error) {
      const status = error.response ? error.response.status : "Unknown";
      if (status === 300) {
        message.warning(
          "Message is already sent. Please wait till you receive the message",
        );
        console.log("setting pin reset stage to 2", status);
        this.setState({
          pinResetStage: resetMethod === "whatsapp" ? 2 : 1,
        });
      } else {
        message.warning(
          error.response?.data?.message ||
            (resetMethod === "whatsapp"
              ? "Phone number does not exist"
              : "Email does not exist"),
        );
        this.setState({
          pinResetStage: 1,
        });
      }
    }
    this.setState({
      sendingPinResetCode: false,
    });
  };

  verifyResetPinCode = async () => {
    const { phoneNumber, otp } = getFormValues(this.state.formData);
    if (!otp || otp.length < 4)
      return message.warning("Please provide valid OTP");

    this.setState({ verifyingOtp: true });

    try {
      const response = await axios.post(
        `${API_BASE_URL}customers/verify-reset-pin`,
        {
          storeId: STORE_ID,
          phoneNumber,
          otp,
        },
      );
      console.log("response", response);
      if (response.status === 200) {
        const verificationToken = response.data?.verificationToken;
        message.success("OTP verified successfully");
        this.setState({ pinResetStage: 3, verificationToken });
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      this.setState({ verifyingOtp: false });
    }
  };

  setLoginPin = async () => {
    const { phoneNumber, otp, newPin, confirmNewPin } = getFormValues(
      this.state.formData,
    );
    if (newPin !== confirmNewPin) return message.warning("Pins do not match");
    if (!newPin || newPin.length < 4)
      return message.warning("Please provide valid PIN");

    this.setState({ settingPin: true });

    try {
      const response = await axios.post(
        `${API_BASE_URL}customers/set-login-pin`,
        {
          storeId: STORE_ID,
          verificationToken: this.state.verificationToken,
          pin: newPin,
        },
      );
      message.success("PIN set successfully. You can now login.");
      this.setState({
        pinResetStage: 0,
      });
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to set PIN");
    } finally {
      this.setState({ settingPin: false });
    }
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
      pinResetStage: 0,
    });
  };

  checkFormValidity = () => {
    const { formData, isSignUp, pinResetStage, resetMethod } = this.state;
    const {
      phoneNumber,
      pin,
      confirmPin,
      referredBy,
      otp,
      newPin,
      confirmNewPin,
      email,
    } = formData;

    if (!isSignUp) {
      if (pinResetStage === 1) {
        return resetMethod === "whatsapp" ? phoneNumber.valid : email.valid;
      }
      if (pinResetStage === 2) return phoneNumber.valid && otp.valid;
      if (pinResetStage === 3)
        return (
          newPin.valid &&
          confirmNewPin.valid &&
          newPin.value === confirmNewPin.value
        );

      return phoneNumber.valid && pin.valid;
    }

    const data = { phoneNumber, pin, confirmPin, referredBy };

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

    const { token } = this.props.router.query;
    if (token) {
      this.setState({
        pinResetStage: 3,
        verificationToken: token,
      });
    }
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
      pinResetStage,
      resetMethod,
      sendingPinResetCode,
      verifyingOtp,
      settingPin,
      formData,
    } = this.state;
    const { isLoggingIn, router } = this.props;

    const {
      referredBy,
      phoneNumber,
      pin,
      confirmPin,
      otp,
      newPin,
      confirmNewPin,
      email,
    } = formData;

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
                {pinResetStage === 1 && (
                  <div
                    className="mb-40"
                    style={{
                      display: "flex",
                      gap: 10,
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      type={resetMethod === "whatsapp" ? "primary" : "default"}
                      onClick={() => this.setState({ resetMethod: "whatsapp" })}
                      style={{ flex: 1 }}
                    >
                      WhatsApp
                    </Button>
                    <Button
                      type={resetMethod === "email" ? "primary" : "default"}
                      onClick={() => this.setState({ resetMethod: "email" })}
                      style={{ flex: 1 }}
                    >
                      Email
                    </Button>
                  </div>
                )}
                {(pinResetStage === 0 ||
                  isSignUp ||
                  (pinResetStage === 1 && resetMethod === "whatsapp") ||
                  (pinResetStage === 2 && resetMethod === "whatsapp") ||
                  pinResetStage === 3) && (
                  <TextField
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    name="phoneNumber"
                    onChange={this.handleChange}
                    value={phoneNumber.value}
                    className="mb-40"
                    required
                    mobile
                    disabled={pinResetStage > 1}
                  />
                )}
                {pinResetStage === 1 && resetMethod === "email" && (
                  <TextField
                    label="Email Address"
                    placeholder="Enter your email address"
                    name="email"
                    onChange={this.handleChange}
                    value={email.value}
                    className="mb-40"
                    required
                  />
                )}
                {!isSignUp && pinResetStage === 0 && (
                  <Pin
                    label="Enter PIN"
                    name="pin"
                    onChange={this.handleChange}
                    className="mb-40"
                    required
                  />
                )}
                {!isSignUp && pinResetStage === 2 && (
                  <Pin
                    label="Enter OTP"
                    name="otp"
                    onChange={this.handleChange}
                    className="mb-40"
                    required
                  />
                )}
                {!isSignUp && pinResetStage === 3 && (
                  <>
                    <Pin
                      label="New PIN"
                      name="newPin"
                      onChange={this.handleChange}
                      className="mb-40"
                      required
                    />
                    <Pin
                      label="Confirm New PIN"
                      name="confirmNewPin"
                      className="mb-40"
                      onChange={this.handleChange}
                      required
                      hint={
                        confirmNewPin.value &&
                        newPin.value !== confirmNewPin.value && (
                          <span className="hint red">The pins don't match</span>
                        )
                      }
                    />
                  </>
                )}
                {!isSignUp && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    <Button
                      onClick={
                        pinResetStage === 1
                          ? this.sendResetPinCode
                          : pinResetStage === 2
                            ? this.verifyResetPinCode
                            : pinResetStage === 3
                              ? this.setLoginPin
                              : this.resetPin
                      }
                      loading={
                        sendingPinResetCode || verifyingOtp || settingPin
                      }
                      // disabled={!this.checkFormValidity()}
                    >
                      {pinResetStage === 1
                        ? resetMethod === "whatsapp"
                          ? "Send Code"
                          : "Send Link"
                        : pinResetStage === 2
                          ? "Verify Code"
                          : pinResetStage === 3
                            ? "Set PIN"
                            : "Forgot Pin"}
                    </Button>
                    {pinResetStage > 0 && (
                      <Button
                        onClick={() => {
                          this.setState({
                            pinResetStage: 0,
                          });
                        }}
                        disabled={
                          sendingPinResetCode || verifyingOtp || settingPin
                        }
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                )}
                {isSignUp && (
                  <>
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
                    <TextField
                      label="Referral Code"
                      placeholder="YXCBE"
                      name="referredBy"
                      max={6}
                      onChange={this.handleChange}
                      value={referredBy.value}
                    />
                  </>
                )}
              </div>
            </div>
            <div className="cart-actions">
              <div
                className={classNames("checkout-button", {
                  disabled:
                    !this.checkFormValidity() ||
                    isLoggingIn ||
                    sendingPinResetCode ||
                    verifyingOtp ||
                    settingPin,
                })}
                onClick={
                  isSignUp
                    ? this.login
                    : pinResetStage === 1
                      ? this.sendResetPinCode
                      : pinResetStage === 2
                        ? this.verifyResetPinCode
                        : pinResetStage === 3
                          ? this.setLoginPin
                          : this.login
                }
              >
                <div className="container">
                  <span>
                    {isSignUp
                      ? "Create Pin"
                      : pinResetStage === 1
                        ? resetMethod === "whatsapp"
                          ? "Send Code"
                          : "Send Link"
                        : pinResetStage === 2
                          ? "Verify Code"
                          : pinResetStage === 3
                            ? "Set PIN"
                            : "Login"}
                  </span>
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
