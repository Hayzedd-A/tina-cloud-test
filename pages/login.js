import { Component } from "react";
import classNames from "classnames";
import { withRouter } from "next/router";
import shallowequal from "shallowequal";

import Main from "../layouts/Main";

import { TextField, Pin } from "../components/FormElements";
import Toaster from "../components/Toaster";
import Tabs from "../components/Tabs";

import { AuthenticationConsumer } from "../providers/AuthenticationProvider";

import { RightArrow } from "../public/static/vectors";
import { getFormValues } from "../utils/functions";

class CreateLogin extends Component {
  constructor(props) {
    super(props);

    const { router } = props;
    const { newUser } = router.query;

    this.state = {
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
      },
      currentTab: newUser ? 1 : 0,
      isTabActive: false,
      isSignUp: !!newUser
    };
  }

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

  switchTab = currentTab => {
    this.setState({
      currentTab,
      isSignUp: !!currentTab
    });
  };

  checkFormValidity = () => {
    const { formData, isSignUp } = this.state;
    const { router } = this.props;
    const { phoneNumber, pin, confirmPin } = formData;

    const data = isSignUp ? formData : { phoneNumber, pin };

    return Object.values(data).every(
      value => value.valid && (isSignUp ? pin.value === confirmPin.value : true)
    );
  };

  login = () => {
    const { isSignUp } = this.state;
    const { login, register, router } = this.props;
    const { phoneNumber, pin } = getFormValues(this.state.formData);

    isSignUp
      ? register(
          { phoneNumber, pin, storeId: "ba629b0f-9749-4097-bfc7-825fdcfe6811" },
          () => router.push("/my-account"),
          error =>
            this.openToaster(
              "error",
              error || `An error occurred. Please try again.`
            )
        )
      : login(
          { phoneNumber, pin },
          () => router.push("/my-account"),
          error => this.openToaster("error", error || `Invalid login details`)
        );
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

  setTabBg = () => {
    const tab = document
      .getElementById("tab-container-ref")
      .getBoundingClientRect();

    this.setState({
      isTabActive: tab && tab.top <= 0
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
        isSignUp: !!newUser
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.setTabBg);
  }

  render() {
    const { currentTab, toaster, isTabActive, isSignUp } = this.state;
    const { isLoggingIn, router } = this.props;

    const tabs = ["Login", "Sign up"];

    return (
      <Main>
        <div className="cart-container login-container">
          <div className="cart-header login-header">
            <div
              className="back"
              onClick={() =>
                router.push(`/`, undefined, {
                  shallow: true
                })
              }
            >
              <RightArrow />
            </div>
            <div className="title">{isSignUp ? "Sign Up" : "Login"}</div>
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
                {isSignUp && (
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
                    <span>{isSignUp ? "Create Pin" : "Login"}</span>
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
