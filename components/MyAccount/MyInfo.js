import { Component } from "react";
import Geosuggest from "react-geosuggest";
import * as classNames from "classnames";
import { Tabs } from "antd";

import { TextField, Pin } from "../FormElements";
import Toaster from "../Toaster";

import { AuthenticationConsumer } from "../../providers/AuthenticationProvider";

import { RightArrow } from "../../public/static/vectors";
import { patchFormValues, getFormValues } from "../../utils/functions";

import axios from "axios";
import { API_BASE_URL } from "../../constants";

const initialFormData = {
  name: {
    value: "",
    valid: false,
  },
  phoneNumber: {
    value: "",
    valid: false,
  },
  email: {
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
};

class MyInfo extends Component {
  state = {
    formData: { ...initialFormData },
    activeTab: "1",
  };

  handleChange = ({ target }, valid) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [target.name]: {
          value: target.value,
          valid,
        },
      },
    });
  };

  checkFormValidity = () => {
    const { formData, activeTab } = this.state;
    if (activeTab === "1") {
      // Validate basic info fields
      return ["name", "email", "phoneNumber"].every(
        (key) => formData[key] && formData[key].valid
      );
    } else {
      // For Security tab, ensure both PINs are exactly 4 characters and match
      const { pin, confirmPin } = formData;
      return (
        pin.value.length === 4 &&
        confirmPin.value.length === 4 &&
        pin.value === confirmPin.value
      );
    }
  };

  onSuggestSelect = (suggest) => {
    if (suggest) {
      this.setState({
        formData: {
          ...this.state.formData,
          address: {
            value: suggest.gmaps.formatted_address,
            valid: true,
          },
        },
      });
    }
  };

  onSuggestNoResults = (userInput) => {
    console.log("no results for " + userInput);
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

  onTabChange = (activeTab) => {
    this.setState({ activeTab });
  };

  submit = () => {
    const { activeTab } = this.state;
    let formData = getFormValues(this.state.formData);
    if (activeTab === "1") {
      // Only send basic info
      const { pin, confirmPin, ...basicInfo } = formData;
      formData = basicInfo;
    } else {
      // Only send the new PIN
      const { pin } = formData;
      formData = { pin };
    }
    this.props.updateProfile(formData, (outcome, message) => {
      this.openToaster(outcome, message);
    });
  };

  componentDidMount() {
    const currentUser = localStorage.getItem("gourmet-twist-user");

    if (currentUser) {
      const formData = patchFormValues(
        initialFormData,
        JSON.parse(currentUser).customer
      );

      this.getReferralCode(formData);
    }
  }

  async getReferralCode(formData) {
    const data = await axios.get(`${API_BASE_URL}auth/customer/referral-code`, {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("gourmet-twist-user")).jwt
        }`,
      },
    });

    return this.setState({
      formData: {
        ...formData,
        referralCode: data.data.customer.referralCode,
      },
    });
  }

  render() {
    const { toaster, formData } = this.state;
    const { isUpdatingProfile } = this.props;
    const { name, phoneNumber, referralCode, email, pin, confirmPin } =
      formData;

    return (
      <>
        <div className="container">
          <Tabs
            activeKey={this.state.activeTab}
            onChange={this.onTabChange}
            type="card"
            size="large"
            tabBarStyle={{ fontSize: "16px", textTransform: "uppercase" }}
          >
            <Tabs.TabPane tab="Basic Information" key="1">
              <div className="container">
                <TextField
                  label="Name"
                  placeholder="Enter your name"
                  name="name"
                  value={name.value}
                  onChange={this.handleChange}
                  className="mb-40"
                  required
                />
                <TextField
                  label="Email Address"
                  placeholder="Enter your email address"
                  type="email"
                  name="email"
                  value={email.value}
                  onChange={this.handleChange}
                  className="mb-40"
                  required
                />
                <TextField
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  name="phoneNumber"
                  type="phone"
                  readOnly
                  value={phoneNumber.value}
                  onChange={this.handleChange}
                  className="mb-40"
                  required
                />
                <TextField
                  label="My Referral Code"
                  type="text"
                  style={{ background: "#e5e5e1" }}
                  referralCode={referralCode}
                  value={referralCode}
                  className="mb-40"
                  readOnly
                  onChange={this.handleChange}
                />
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Security" key="2">
              <div className="container">
                <Pin
                  label="Enter New PIN"
                  name="pin"
                  onChange={this.handleChange}
                  className="mb-40"
                  required
                />
                <Pin
                  label="Confirm New PIN"
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
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className="cart-actions">
          <div
            className={classNames("checkout-button", {
              disabled: !this.checkFormValidity() || isUpdatingProfile,
            })}
            onClick={this.submit}
          >
            <div className="container">
              <span>Submit</span>
              <RightArrow />
            </div>
          </div>
        </div>
        {toaster && <Toaster {...toaster} closeToaster={this.closeToaster} />}
      </>
    );
  }
}

export default AuthenticationConsumer(MyInfo);
