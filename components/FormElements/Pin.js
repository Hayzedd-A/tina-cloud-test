import React, { Component, createRef } from "react";
import classNames from "classnames";
import ReactCodeInput from "react-code-input";

class TextField extends Component {
  state = {
    active: false,
    isValid: false,
    isBlurred: false
  };

  textFieldRef = createRef();

  onChange = (value, isBlurred) => {
    let { isValid } = this.state;
    const {
      required,
      name,
      onBlur,
      onChange
    } = this.props;

    isValid = required ? value !== "" : true;

    console.log("focues", isBlurred);

    this.setState({
      isValid,
      isBlurred,
      isFocused: !isBlurred
    });

    onChange({ target: { name, value } }, isValid);

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
      className,
      label,
      hint
    } = this.props;

    return (
      <div
        className={classNames(`input-container ${className || ""}`, {
          isFocused,
          error: !isValid && isBlurred
        })}
      >
        {label && <label>{label}</label>}
        <div onClick={e => e.stopPropagation()}>
          <ReactCodeInput
            type="password"
            style={{ display: "grid" }}
            className="react-code-input"
            fields={4}
            onChange={this.onChange}
            autoFocus={false}
          />
        </div>
        {hint && <span className="hint red">{hint}</span>}
      </div>
    );
  }
}

export default TextField;
