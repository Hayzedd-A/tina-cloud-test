import React from "react";

import { Check } from "../../public/static/vectors";

const Checkbox = ({ label, className, ...rest }) => (
  <div className="checkbox-container">
    <label className={`checkbox ${className || ""}`}>
      <input type="checkbox" {...rest} />
      <span className="checkbox-display">
        <Check />
      </span>
      {label && <span className="checkbox-label">{label}</span>}
    </label>
  </div>
);

export default Checkbox;
