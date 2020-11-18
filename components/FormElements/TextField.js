import React, { Component, createRef } from "react";
import classNames from "classnames";

class TextField extends Component {
  state = {
    active: false,
    isValid: false,
    isBlurred: false
  };

  textFieldRef = createRef();

  onChange = ({ target }, isBlurred) => {
    let { isValid } = this.state;
    const {
      type,
      required,
      min,
      mobile,
      max,
      name,
      onBlur,
      onChange
    } = this.props;
    const { value } = target;

    isValid = required ? value !== "" : true;

    if (type === "email") {
      var re = /[^@]+@[^@]+\.[^@]+/;
      isValid = re.test(String(value).toLowerCase());
    }

    if (min) {
      isValid = value.length >= min;
    }

    this.setState({
      isValid,
      isBlurred,
      isFocused: !isBlurred
    });

    if (mobile) {
      const re = /^[0-9\b]+$/;

      if (value === "" || (re.test(value) && value.length <= 11)) {
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

    isBlurred && onBlur && onBlur();
  };

  onFocus = () => {
    const { onFocus } = this.props;

    this.setState(
      {
        isFocused: true
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
      onChange,
      onFocus,
      onBlur,
      min,
      mobile,
      ...rest
    } = this.props;

    return (
      <div
        className={classNames(`input-container ${className || ""}`, {
          isFocused,
          error: !isValid && isBlurred
        })}
      >
        {label && (
          <label>
            {label} {required && <sup className="marked">*</sup>}
          </label>
        )}
        <div onClick={e => e.stopPropagation()}>
          <input
            ref={this.textFieldRef}
            className="input"
            {...rest}
            onBlur={e => this.onChange(e, true)}
            onChange={this.onChange}
            onFocus={this.onFocus}
          />
        </div>
      </div>
    );
  }
}

export default TextField;
