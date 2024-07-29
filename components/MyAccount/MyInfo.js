import { Component } from "react";
import Geosuggest from "react-geosuggest";
import * as classNames from "classnames";

import { TextField } from "../FormElements";
import Toaster from "../Toaster";

import { AuthenticationConsumer } from "../../providers/AuthenticationProvider";

import { RightArrow } from "../../public/static/vectors";
import { patchFormValues, getFormValues } from "../../utils/functions";

import axios from "axios";
import { API_BASE_URL } from "../../constants";

const initialFormData = {
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
  }
};

class MyInfo extends Component {
  state = {
    formData: { ...initialFormData }
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
    if (suggest) {
      debugger
      this.setState({
        formData: {
          ...this.state.formData,
          address: {
            value: suggest.gmaps.formatted_address,
            valid: true
          }
        }
      });
    }
  };

  onSuggestNoResults = userInput => {
    console.log("no results for " + userInput);
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

  submit = () => {
    const formData = getFormValues(this.state.formData);

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

      this.getReferralCode(formData)
    }
  }

  async getReferralCode(formData) {
    const data = await axios.get(`${API_BASE_URL}auth/customer/referral-code`, {
      headers: {
        "Authorization": `Bearer ${JSON.parse(localStorage.getItem("gourmet-twist-user")).jwt}`
      }
    });

    return this.setState({
      formData: {
        ...formData,
        referralCode: data.data.customer.referralCode
      }
    });
  }

  render() {
    const { toaster, formData } = this.state;
    const { isUpdatingProfile } = this.props;
    const { name, phoneNumber, referralCode, email } = formData;

    return (
      <>
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
            value={phoneNumber.value}
            onChange={this.handleChange}
            className="mb-40"
            required
          />
          <TextField
            label="My Referral Code"
            type="text"
            referralCode={referralCode}
            value={referralCode}
            className="mb-40"
            readOnly
            onChange={this.handleChange}
          />
        </div>
        <div className="cart-actions">
          <div
            className={classNames("checkout-button", {
              disabled: !this.checkFormValidity() || isUpdatingProfile
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
