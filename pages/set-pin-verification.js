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
    const { newUser, token } = router.query;

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
        name: {
          value: "",
          valid: false,
        },
      },
      pinResetLayout: true,
      token,
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
          "Message is already sent. Please wait till you receive the message"
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

    return Object.values({ phoneNumber, pin }).every(
      (value) =>
        value.valid && (isSignUp ? pin.value === confirmPin.value : true)
    );
  };

  resetPin = async () => {
    const { phoneNumber, token, pin } = getFormValues(this.state.formData);

    const { data } = await axios.post(
      `${API_BASE_URL}customer-requests/stores/${STORE_ID}/${this.state.token}/confirm-set-pin-code`,
      { customerPin: pin }
    );

    if (data !== "Success")
      return message.error("There was an error resetting your pin code");

    message.success("Pin code has been reset");
    this.props.router.push("/login");
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
    if (this.state.token) {
      this.loadVerificationFromToken(this.state.token);
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

  loadVerificationFromToken = async (token) => {
    if (!token) return;
    this.setState({ loadingVerification: true });
    try {
      // If your API expects POST, keep as POST; if it’s GET, switch accordingly.
      const { data } = await axios.get(
        `${API_BASE_URL}customer-requests/stores/${STORE_ID}/${token}/get-user-verification-token`
      );
      const { phoneNumber, name } = data || {};
      if (phoneNumber) {
        this.setState((prev) => ({
          formData: {
            ...prev.formData,
            phoneNumber: { value: phoneNumber, valid: true },
            name: { value: name, valid: true },
          },
          loadingVerification: false,
        }));
        // message.success("Phone number verified.");
      } else {
        this.setState({ loadingVerification: false });
        message.error("WARR GYA");
      }
    } catch (err) {
      this.setState({ loadingVerification: false });
      const msg =
        "Invalid request. Please visit the link sent to you on your whatsapp";
      this.openToaster("error", msg);
    }
  };

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

    const { phoneNumber, name, pin, confirmPin } = formData;

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
          <div className="checkout-form login-form">
            <div className="container">
              <div className="login-form-content">
                <div
                  style={{
                    marginBottom: 30,
                  }}
                >
                  <span style={{ fontSize: "15pt", fontWeight: "bold" }}>
                    {name.value}
                  </span>
                  <p style={{ marginTop: 10, fontSize: 20 }}>
                    {phoneNumber.value}
                  </p>
                </div>
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
              </div>
            </div>
            <div className="cart-actions">
              <div
                className={classNames("checkout-button", {
                  disabled:
                    !this.checkFormValidity() ||
                    pin.value !== confirmPin.value ||
                    isLoggingIn,
                })}
                onClick={this.resetPin}
              >
                <div className="container">
                  <span>Create Pin</span>
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
