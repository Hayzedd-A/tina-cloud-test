import { Component } from "react";
import { withRouter } from "next/router";
import classNames from "classnames";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import { getRequest } from "../../api";

import { CartConsumer } from "../../providers/CartProvider";
import { StoreConsumer } from "../../providers/StoreProvider";
import { TextField, Radio } from "../FormElements";

import { NumberSelector } from "../FormElements";

import { RightArrow, EmptyCart } from "../../public/static/vectors";
import { HeaderMenu } from "../Header";
import { STORE_ID } from "../../constants";
import {
  reduceArray,
  reduceLinearArray,
  getFormValues,
  getRequestError,
  paystack,
  patchFormValues,
} from "../../utils/functions";

class Cart extends Component {
  state = {
    formData: {
      couponCode: {
        value: "",
        valid: false,
      },
    },
    isApplyingCouponCode: false,
    isMenuActive: false,
    showCouponSection: false,
  };

  cartAction = (item, quantity) => {
    const { updateCart, removeFromCart } = this.props;
    const { unitPrice } = item;

    let toppings = JSON.parse(JSON.stringify(item.toppings));

    toppings = toppings.map((topping) => ({
      ...topping,
      quantity,
    }));

    const toppingsPrices = toppings.map(
      (topping) => parseFloat(topping.unitPrice) * quantity
    );

    const toppingsTotalCost = reduceLinearArray(toppingsPrices);
    const totalCost = toppingsTotalCost + parseFloat(unitPrice) * quantity;

    quantity === 0
      ? removeFromCart(item)
      : updateCart({ ...item, quantity, toppings, totalCost });
  };

  showMenu = (isMenuActive) => {
    this.setState({ isMenuActive });
  };

  handleApplyCouponCode = async () => {
    const {
      formData: { couponCode },
    } = this.state;
    console.log("I got here: ", couponCode.value);
    this.setState({
      isApplyingCouponCode: true,
    });
    await this.props.handleApplyCouponCode();
    this.setState({
      isApplyingCouponCode: false,
    });
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

  componentDidMount = async () => {
    await this.props?.fetchStoreInfo();
    window.scrollTo(0, 0);
  };

  render() {
    const { isLoadingCart, cart, checkout, router } = this.props;
    const { isMenuActive, showCouponSection, isApplyingCouponCode } =
      this.state;
    const { couponCode, couponObject } = this.props;

    const subTotal = reduceArray(cart, "totalCost");
    const minimumAmount = 2500;

    console.log(subTotal, couponObject);

    const discountAmount = couponObject
      ? couponObject.discountType === "percent"
        // ? ((couponObject.value * subTotal) / 100).toLocaleString()
        ? ((couponObject.value * subTotal) / 100)
        : couponObject.value
      : null;
    // return <div>Hello</div>
    return (
      <div className="cart-container full-height">
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
            <div
              className="back"
              onClick={() =>
                router.push(`/`, undefined, {
                  shallow: true,
                })
              }
            >
              <RightArrow />
            </div>
            <div className="title">My Cart</div>
            <div
              className="header-icon-container hamburger-menu right-menu"
              style={{ top: "-12px" }}
              onClick={() => this.showMenu(true)}
            >
              <span></span>
            </div>
            <CSSTransitionGroup
              transitionName="header-menu-animation"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={300}
            >
              {isMenuActive && <HeaderMenu showMenu={this.showMenu} />}
            </CSSTransitionGroup>
          </div>
          {!!cart.length && (
            <div className="info delivery-notice">
              <span className="icon">
                <img src="/static/images/delivery.png" alt="" />
              </span>
              <span className="text">
                Delivery Fees will be calculated in the next step
              </span>
            </div>
          )}
        </div>
        {!isLoadingCart &&
          (cart.length ? (
            <>
              <div className="cart-content">
                <div className="cart-items">
                  <div className="title">
                    <div className="container">ITEM</div>
                  </div>
                  {cart.map((cartItem, index) => {
                    const {
                      id,
                      imageUrl,
                      name,
                      size,
                      quantity,
                      unitPrice,
                      totalCost,
                      toppings,
                    } = cartItem;

                    return (
                      <div key={`cart-item-${index}`} className="cart-item">
                        <div className="container">
                          <div className="image">
                            <img
                              src={
                                imageUrl || "/static/svgs/image-placeholder.svg"
                              }
                              alt=""
                            />
                          </div>
                          <div className="info">
                            <div className="main-description">
                              <span className="name ellipsis">{name}</span>
                              <span className="price">
                                ₦ {(totalCost || 0).toLocaleString()}
                              </span>
                            </div>
                            <div className="mini-description">
                              <span className="name ellipsis">
                                {size} (x{quantity})
                              </span>
                              <span className="price">
                                ₦{unitPrice?.toLocaleString()} x {quantity}
                              </span>
                            </div>
                            {toppings.map((topping, index) => (
                              <div
                                key={`topping-${index}`}
                                className="mini-description"
                              >
                                <span className="name ellipsis">
                                  {topping.name} (x{topping.quantity})
                                </span>
                                <span className="price">
                                  ₦{topping.unitPrice?.toLocaleString()} x{" "}
                                  {topping.quantity}
                                </span>
                              </div>
                            ))}
                            <NumberSelector
                              key={index}
                              index={index}
                              value={quantity}
                              onChange={(e) =>
                                this.cartAction(cartItem, e.target.value)
                              }
                              className="small"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="container">
                  <div className="row" style={{ alignItems: "flex-end" }}>
                    <div className="col-12">
                      <div
                        style={{
                          marginBottom: "20px",
                          textDecoration: "underline",
                          width: "fit-content",
                        }}
                        onClick={() =>
                          this.setState({
                            showCouponSection: !showCouponSection,
                          })
                        }
                      >
                        I have a coupon code
                      </div>
                      {showCouponSection && (
                        <div className="row" style={{ alignItems: "flex-end" }}>
                          <div className="col-8">
                            <TextField
                              label="Coupon Code"
                              placeholder="Enter a coupon code for discount"
                              name="couponCode"
                              value={couponCode.value}
                              onChange={this.props.handleChangeCouponCode}
                              className="mb-40"
                            />
                          </div>
                          <div className="col-4">
                            <button
                              onClick={this.handleApplyCouponCode}
                              className={classNames("button-coupon mb-40", {
                                disabled:
                                  !couponCode.value || isApplyingCouponCode,
                              })}
                            >
                              {isApplyingCouponCode
                                ? "Applying..."
                                : "Apply Code"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="sub-total">
                  <div className="container">
                    <span className="title">Sub Total</span>
                    <span
                      className="value"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      ₦ {(subTotal - discountAmount).toLocaleString()}
                      {discountAmount && (
                        <span style={{ fontSize: "16px", marginLeft: "10px" }}>
                          <strike className="small">
                            {" "}
                            {subTotal.toLocaleString()}
                          </strike>{" "}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="cart-actions no-margin fixed">
                {!!couponObject && (
                  <div className="delivery-fees-notice">
                    <div className="container">
                      <span className="text">
                        {couponObject.discountType === "percent" &&
                          `${couponObject.value}% discount - `}
                        ₦{discountAmount?.toLocaleString()} will be deducted - (
                        {couponObject.name})
                      </span>
                    </div>
                  </div>
                )}
                <div
                  className={classNames("checkout-button", {
                    disabled: !cart.length || subTotal < minimumAmount,
                  })}
                  onClick={subTotal >= minimumAmount && checkout}
                >
                  <div
                    className="container"
                    style={{
                      textAlign: "center",
                      padding: "0px 20px",
                      lineHeight: "20px",
                    }}
                  >
                    {subTotal >= minimumAmount ? (
                      <span>Checkout</span>
                    ) : (
                      <span style={{ fontSize: ".7em" }}>
                        Oops! Minimum order value is N2,500. Please add more
                        items.
                      </span>
                    )}
                    {subTotal >= minimumAmount && <RightArrow />}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="cart-empty-state">
              <div className="icon">
                <EmptyCart />
              </div>
              <div className="message">Your cart is currently empty</div>
              <div className="action" onClick={() => router.push("/")}>
                Shop now
              </div>
            </div>
          ))}
      </div>
    );
  }
}

export default StoreConsumer(CartConsumer(withRouter(Cart)));
