import React from "react";

import { Check } from "../../public/static/vectors";

const Checkbox = ({ label, availableBreadMainLabel, availableBreadChildLabel, className, ...rest }) => (
  <div className="checkbox-container" style={{
    display: availableBreadMainLabel && 'inline-block'
  }}>
    <label className={`checkbox ${className || ""}`}>

      {
        (availableBreadMainLabel || availableBreadChildLabel) ?
          <>
            <input type="checkbox" {...rest} />
            <span className="checkbox-display" style={{ width: 17, height: 17 }}>
              <Check />
            </span>
            &nbsp;&nbsp;
            {
              availableBreadChildLabel ? <span>{availableBreadChildLabel}</span> : <span style={{ fontWeight: 'bold' }}>{availableBreadMainLabel}</span>
            }
          </> :
          <>
            <input type="checkbox" {...rest} />
            <span className="checkbox-display">
              <Check />
            </span>
            {label && <span className={`checkbox-label`}>{label}</span>}
          </>
      }
    </label>
  </div>
);

export default Checkbox;
