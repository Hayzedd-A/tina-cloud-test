import { Component } from "react";
import { withRouter } from "next/router";
import classNames from "classnames";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import { getRequest, postRequest } from "../../api";

import Link from "next/link";

import { CartConsumer } from "../../providers/CartProvider";
import { StoreConsumer } from "../../providers/StoreProvider";
import { TextField, Radio } from "../FormElements";

import { NumberSelector } from "../FormElements";

import { RightArrow, EmptyCart, ModalBread } from "../../public/static/vectors";
import { HeaderMenu } from "../Header";
import { STORE_ID } from "../../constants";
import Loader from "../Loader";

import {
  reduceArray,
  reduceLinearArray,
  getFormValues,
  getRequestError,
  paystack,
  patchFormValues,
} from "../../utils/functions";
import analyticsService from "../../services/analyticsService";
import { Modal } from "antd";
import {
  CheckCircleFilled,
  Loading3QuartersOutlined,
  WarningTwoTone,
} from "@ant-design/icons";

class Cart extends Component {
  state = {
    formData: {
      couponCode: {
        value: "",
        valid: false,
      },
    },
    formData: {
      loyaltyPointApplied: {
        value: "",
        valid: false,
      },
    },
    isApplyingCouponCode: false,
    isMenuActive: false,
    showCouponSection: false,
    showGCSection: false,
    paymentStatus: "idle",
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
    this.setState({
      isApplyingCouponCode: true,
    });
    await this.props.handleApplyCouponCode();
    this.setState({
      isApplyingCouponCode: false,
    });
  };

  handleApplyLoyaltyDiscount = async () => {
    const {
      formData: { loyaltyPointApplied },
    } = this.state;
    await this.props.handleApplyCouponCode();
    this.setState({
      isApplyingCouponCode: false,
    });
  };

  showCheckoutSuccess = this.props.showCheckoutSuccess;

  handleApplyGCCode = async () => {
    const {
      formData: { giftCardCode },
    } = this.state;
    this.setState({
      isApplyingGC: true,
    });
    await this.props.handleApplyGCCode();
    this.setState({
      isApplyingGC: false,
    });
  };

  handleApplyDCCode = async () => {
    this.setState({
      isApplyingDC: true,
    });
    await this.props.handleApplyDCCode();
    this.setState({
      isApplyingDC: false,
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
    console.log("xxxxxx  this.props", this.props.router.query);
    const { verify, orderReference } = this.props.router.query;
    if (verify && orderReference) {
      try {
        console.log("verifying payment for order ref:", orderReference);
        // Verify order here
        this.setState({ paymentStatus: "loading" });
        const { data } = await postRequest({
          url: "/payment/nomba/verify-reference",
          data: { reference: orderReference },
        });
        console.log(data.status);
        this.setState({ paymentStatus: data.status });
        localStorage.removeItem("gourmettwistcart");
        console.log({func: this.showCheckoutSuccess})
        this.showCheckoutSuccess(true);
        // Clear query parameters to prevent re-verification on reload
      } catch (error) {
        console.error("Error verifying payment:", getRequestError(error));
        this.setState({ paymentStatus: "idle" });
      } finally {
        this.props.router.replace('/cart');
        setTimeout(() => {
          // this.setState({ paymentStatus: "idles" });
        }, 1000);
      }
    }
    window.scrollTo(0, 0);
  };

  componentDidUpdate(prevProps, prevState) {
    const { cart, couponObject, loyaltyPointApplied, giftCardObject } =
      this.props;

    const subTotal = reduceArray(cart, "totalCost");
    const discountAmountGc = giftCardObject ? giftCardObject.remainingValue : 0;
    const loyaltyDiscountApplied = parseFloat(loyaltyPointApplied.value || 0);

    let discountAmount = couponObject
      ? couponObject.discountType === "percent"
        ? (couponObject.value * subTotal) / 100
        : couponObject.value
      : 0;

    if (loyaltyDiscountApplied) discountAmount += loyaltyDiscountApplied;
    if (discountAmountGc) discountAmount += discountAmountGc;

    let finalAmount = subTotal - discountAmount;
    if (finalAmount < 0) finalAmount = 0;

    if (finalAmount < 25000 && this.props.deliveryDiscountObject?.id) {
      this.props.resetDeliveryDiscount();
    } else if (
      finalAmount >= 25000 &&
      !this.props.deliveryDiscountObject?.id &&
      !this.state.isApplyingDC
    ) {
      this.handleApplyDCCode();
    }
  }

  render() {
    const { isLoadingCart, cart, checkout, router } = this.props;
    const { isMenuActive, showCouponSection, isApplyingCouponCode } =
      this.state;
    const {
      couponCode,
      couponObject,
      loyaltyPointApplied,
      loyaltyPointsAvailable,
      giftCardCode,
      giftCardObject,
      deliveryDiscountCode,
      deliveryDiscountObject,
    } = this.props;

    const { showGCSection, isApplyingGC } = this.state;

    const { showDCSection, isApplyingDC } = this.state;

    const subTotal = reduceArray(cart, "totalCost");
    const minimumAmount = 4500;

    const discountAmountGc = giftCardObject ? giftCardObject.remainingValue : 0;

    const loyaltyDiscountApplied = parseFloat(loyaltyPointApplied.value || 0);

    let discountAmount = couponObject
      ? couponObject.discountType === "percent"
        ? (couponObject.value * subTotal) / 100
        : couponObject.value
      : null;

    if (loyaltyDiscountApplied)
      discountAmount = (discountAmount || 0) + loyaltyDiscountApplied;

    if (discountAmountGc)
      discountAmount = (discountAmount || 0) + discountAmountGc;

    let finalAmount = subTotal - discountAmount;
    if (finalAmount <= 0) finalAmount = 0;

    return (
      <div className="cart-container full-height">
        <Modal
          visible={this.state.paymentStatus !== "idle"}
          closeIcon={null}
          centered={true}
          width={350}
          footer={null}
        >
          <div className="add-cart-success">
            <div className="icon">
              {/* <Loader size={30} style={{ marginBottom: 20 }} /> */}
            </div>
            {this.state.paymentStatus === "loading" && (
              <>
                <div className="message">
                  <Loading3QuartersOutlined spin style={{ fontSize: 30 }} />
                  <p>Verifing payment status, Please wait...</p>
                </div>
              </>
            )}
            {this.state.paymentStatus === "PAID" && (
              <>
                <div className="message">
                  <ModalBread />
                  <p>
                    Payment verified successfully! Thank you for your purchase.
                  </p>
                </div>
              </>
            )}
            {this.state.paymentStatus === "PENDING" && (
              <>
                <div className="message">
                  <WarningTwoTone style={{ fontSize: 30, color: "#52c41a" }} />
                  <p>
                    Your payment is still pending. Please check status in your
                    orders
                  </p>
                </div>
              </>
            )}
            <div className="actions">
              {/* <button
              className="continue"
              onClick={() => {
                location.href = "/cart";
              }}
            >
              Checkout
            </button> */}
              {/* <button
                className="continue"
                onClick={() => {
                  this.setState({ paymentStatus: "idle" });
                  router.push("/my-orders");
                }}
              >
                Go to Orders
              </button> */}
            </div>
          </div>
        </Modal>
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
          {!!cart?.length && (
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
          (cart?.length ? (
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
                {!giftCardObject && (
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
                          <div
                            className="row"
                            style={{ alignItems: "flex-end" }}
                          >
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
                )}
                {!JSON.parse(localStorage.getItem("gourmet-twist-user")) && (
                  <div className="container" style={{ marginTop: 5 }}>
                    <div className="row">
                      <div className="col-12">
                        <div
                          style={{
                            marginBottom: "20px",
                            // textDecoration: "underline",
                            width: "fit-content",
                          }}
                        >
                          <Link href="/login">
                            Have reward points? Login to avail discount
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {!couponObject && (
                  <div className="container">
                    <div className="row" style={{ alignItems: "flex-end" }}>
                      <div className="col-12">
                        <div
                          style={{
                            marginBottom: "20px",
                            textDecoration: "underline",
                            cursor: "pointer",
                            width: "fit-content",
                          }}
                          onClick={() =>
                            this.setState({
                              showGCSection: !showGCSection,
                            })
                          }
                        >
                          I have a gift card
                        </div>
                        {showGCSection && (
                          <div
                            className="row"
                            style={{ alignItems: "flex-end" }}
                          >
                            <div className="col-8">
                              <TextField
                                label="Gift Card Code"
                                placeholder="Enter a gift card code for discount"
                                name="giftCard"
                                value={giftCardCode.value}
                                onChange={this.props.handleChangeGiftCardCode}
                                className="mb-40"
                              />
                            </div>
                            <div className="col-4">
                              <button
                                onClick={this.handleApplyGCCode}
                                className={classNames("button-coupon mb-40", {
                                  disabled: !giftCardCode.value || isApplyingGC,
                                })}
                              >
                                {isApplyingGC
                                  ? "Applying..."
                                  : "Apply Gift Card"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {loyaltyPointsAvailable?.available &&
                  parseInt(loyaltyPointsAvailable?.available) > 0 && (
                    <div className="container">
                      <div className="row" style={{ alignItems: "flex-end" }}>
                        <div className="col-12">
                          <div
                            className="row"
                            style={{ alignItems: "flex-end" }}
                          >
                            <div className="col-12">
                              <TextField
                                label="Loyalty Discount"
                                placeholder="Provide discount amount"
                                name="loyaltyPointApplied"
                                loyaltyPointsAvailable={loyaltyPointsAvailable}
                                value={loyaltyPointApplied.value}
                                onChange={this.props.handleChangeLoyaltyPoints}
                                className="mb-40"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                <div className="sub-total">
                  <div className="container">
                    <span className="title">Sub Total</span>
                    <span
                      className="value"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      ₦ {finalAmount.toLocaleString()}
                      {discountAmount ? (
                        <span style={{ fontSize: "16px", marginLeft: "10px" }}>
                          <strike className="small">
                            {" "}
                            {subTotal.toLocaleString()}
                          </strike>{" "}
                        </span>
                      ) : null}
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
                        ₦
                        {(discountAmount > subTotal
                          ? subTotal
                          : discountAmount
                        )?.toLocaleString()}{" "}
                        will be deducted - ({couponObject.name})
                      </span>
                      <span
                        onClick={() =>
                          this.props.handleChangeCouponCode({
                            value: 0,
                            valid: false,
                          })
                        }
                        style={{
                          background: "black",
                          color: "white",
                          padding: "5px 10px",
                          cursor: "pointer",
                          fontSize: 12,
                          marginLeft: 10,
                        }}
                      >
                        CLEAR
                      </span>
                    </div>
                  </div>
                )}
                {!!giftCardObject && (
                  <div className="delivery-fees-notice">
                    <div className="container">
                      <span
                        className="text"
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span>
                          ₦
                          {(discountAmount > subTotal
                            ? subTotal
                            : discountAmount
                          )?.toLocaleString()}{" "}
                          will be deducted - ({giftCardObject.name})
                        </span>
                      </span>
                      <span
                        onClick={() =>
                          this.props.handleChangeGiftCardCode({
                            value: 0,
                            valid: false,
                          })
                        }
                        style={{
                          background: "black",
                          color: "white",
                          padding: "5px 10px",
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        CLEAR
                      </span>
                    </div>
                  </div>
                )}
                <div
                  className={classNames("checkout-button", {
                    disabled: !cart?.length || subTotal < minimumAmount,
                  })}
                  onClick={() => {
                    analyticsService.trackCheckoutInitiated({
                      cart,
                      subTotal,
                    });
                    subTotal >= minimumAmount && checkout();
                  }}
                >
                  <div
                    className="container"
                    style={{
                      textAlign: "center",
                      padding: "0px 20px",
                      lineHeight: "20px",
                      zIndex: 999999999999,
                    }}
                  >
                    {subTotal >= minimumAmount ? (
                      <span>Checkout</span>
                    ) : (
                      <>
                        <span style={{ fontSize: ".7em" }}>
                          Oops! Minimum order value is N4,500. Please add more
                          items.
                        </span>
                      </>
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
