import React, { Component, createRef } from "react";
import classNames from "classnames";

class SelectField extends Component {
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
      options,
      ...rest
    } = this.props;

    if (name === "phoneNumber") {
      console.log(isBlurred, isValid);
    }
    return (
      <div
        className={classNames(`input-container ${className || ""}`, {
          isFocused,
          error: !isValid && isBlurred,
        })}
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
        <div onClick={(e) => e.stopPropagation()}>
          <select
            className="select mb-4"
            ref={this.textFieldRef}
            {...rest}
            onBlur={(e) => this.onChange(e, true)}
            onChange={this.onChange}
            onFocus={this.onFocus}
          >
            {options.map(({ label, key }, index) => {
              return <option value={key}>{label}</option>;
            })}
          </select>
          {/* <input
            ref={this.textFieldRef}
            className="input"
            {...rest}
            onBlur={e => this.onChange(e, true)}
            onChange={this.onChange}
            onFocus={this.onFocus}
          /> */}
        </div>
      </div>
    );
  }
}

export default SelectField;
