import React from "react";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import { HeaderMenu } from "../../../Header";
import { RightArrow } from "../../../../public/static/vectors";
import { MINIMUM_ORDER_AMOUNT } from "../constants/checkoutConstants";

const CheckoutHeader = ({ goBack, priceCheck, isMenuActive, showMenu }) => {
  return (
    <div className="cart-header">
      <div
        className="container login-header-inner"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="back" onClick={goBack}>
          <RightArrow />
        </div>
        <div className="title">Checkout</div>
        <div
          className="header-icon-container hamburger-menu right-menu"
          style={{ top: "-12px" }}
          onClick={() => showMenu(true)}
        >
          <span></span>
        </div>
        <CSSTransitionGroup
          transitionName="header-menu-animation"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          {isMenuActive && <HeaderMenu showMenu={showMenu} />}
        </CSSTransitionGroup>
      </div>

      <div className="info">
        <span className="icon checkout-icon">
          <img src="/static/images/star.png" alt="" />
        </span>
        {priceCheck ? (
          <span className="text">Well done! You're almost there</span>
        ) : (
          <span className="text" style={{ textAlign: "center" }}>
            Minimum item price for checkout is ₦{MINIMUM_ORDER_AMOUNT.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default CheckoutHeader;