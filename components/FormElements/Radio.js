import React from "react";

import { Check } from "../../public/static/vectors";

const Radio = ({ label, className, ...rest }) => (
  <div className="radio-container">
    <label className={`radio ${className || ""}`}>
      <input type="radio" {...rest} />
      <span className="radio-display">
        <Check />
      </span>
      {label && <span className="radio-label">{label}</span>}
    </label>
  </div>
);

export default Radio;
