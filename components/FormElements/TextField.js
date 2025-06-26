import React, { Component, createRef } from "react";
import classNames from "classnames";
import { CopyOutlined } from "@ant-design/icons";
import { message } from "antd";

class TextField extends Component {
  state = {
    active: false,
    isValid: false,
    isBlurred: false,
  };

  textFieldRef = createRef();

  onChange = ({ target }, isBlurred) => {
    let { isValid } = this.state;
    const { type, required, min, mobile, max, name, onBlur, onChange } =
      this.props;
    const { value } = target;

    isValid = required ? value !== "" : true;

    if (type === "email") {
      var re = /[^@]+@[^@]+\.[^@]+/;
      isValid = re.test(String(value).toLowerCase());
    }

    if (min) {
      isValid = value.length >= min;
    }

    if (mobile) {
      const re = /^[0-9\b]+$/;

      if (value === "" || (re.test(value) && value.length <= 11)) {
        isValid = value.length === 11;

        onChange({ target: { name, value } }, isValid);
      }
    } else if (type === "custom-number") {
      const re = /^[0-9]+$/;

      if (value === "" || re.test(value)) {
        if (max) {
          value.length <= max && onChange({ target: { name, value } }, isValid);
        } else {
          onChange({ target: { name, value } }, isValid);
        }
      }
    } else {
      if (max) {
        value.length <= max && onChange({ target: { name, value } }, isValid);
      } else {
        onChange({ target: { name, value } }, isValid);
      }
    }

    this.setState({
      isValid,
      isBlurred,
      isFocused: !isBlurred,
    });

    isBlurred && onBlur && onBlur();
  };

  onFocus = () => {
    const { onFocus } = this.props;

    this.setState(
      {
        isFocused: true,
      },
      () => onFocus && onFocus()
    );
  };

  render() {
    const { isValid, isBlurred, isFocused } = this.state;
    const {
      required,
      className,
      label,
      name,
      onChange,
      onFocus,
      onBlur,
      min,
      mobile,
      hint,
      referralCode,
      loyaltyPointsAvailable,
      ...rest
    } = this.props;

    if (name === "phoneNumber") {
      console.log(isBlurred, isValid);
    }

    const copyToClipboard = async () => {
      await navigator.clipboard.writeText(referralCode);
      message.success(`Copied to clipboard`);
    };

    return (
      <div
        className={classNames(`input-container ${className || ""}`, {
          isFocused,
          error: !isValid && isBlurred,
        })}
        style={{
          flex: 1,
        }}
      >
        {label && (
          <label>
            {label} {required && <sup className="marked">*</sup>}
            {hint && (
              <i
                style={{
                  textTransform: "capitalize",
                  color: "#333",
                  fontWeight: "bold",
                }}
              >
                {hint}
              </i>
            )}
          </label>
        )}
        {loyaltyPointsAvailable?.available &&
          parseInt(loyaltyPointsAvailable?.available) > 0 && (
            <i>
              <span
                style={{
                  display: "block",
                  fontSize: 14,
                  marginBottom: 10,
                }}
              >
                Loyalty Points Discount Available{" "}
                <b>
                  (N
                  {(
                    loyaltyPointsAvailable.available *
                    loyaltyPointsAvailable.discountPerPoint
                  ).toLocaleString()}
                  )
                </b>
              </span>
            </i>
          )}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ position: referralCode && "relative" }}
        >
          <input
            ref={this.textFieldRef}
            className="input"
            {...rest}
            onBlur={(e) => this.onChange(e, true)}
            onChange={this.onChange}
            onFocus={this.onFocus}
          />
          {referralCode && (
            <CopyOutlined
              onClick={copyToClipboard}
              style={{
                cursor: "pointer",
                fontSize: 18,
                position: "absolute",
                top: 20,
                right: 30,
              }}
            />
          )}
        </div>
      </div>
    );
  }
}

export default TextField;
