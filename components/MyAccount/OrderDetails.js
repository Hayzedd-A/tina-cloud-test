import { Component } from "react";
import * as moment from "moment";

import { RightArrow, ModalBread } from "../../public/static/vectors";
import { reduceArray, reduceLinearArray } from "../../utils/functions";
import { withRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import { CartConsumer } from "../../providers/CartProvider";
import Toaster from "../Toaster";
import Modal from "../Modal";
import analyticsService from "../../services/analyticsService";
import Loader from "../Loader";

class OrderDetails extends Component {
  state = {
    toaster: {},
  };

  openToaster = (status, message) => {
    this.setState({ toaster: { status, message } });
  };

  closeToaster = () => {
    this.setState({ toaster: {} });
  };

  reorderAction = () => {
    const { activeOrderDetails, addToCart } = this.props;
    const { order_items } = activeOrderDetails || {};

    if (!order_items || !order_items.length) return;

    const cartItems = order_items.map((item) => {
      const { product, quantity, toppings } = item;

      let toppingsPrices = 0;
      (toppings || []).forEach((topping) => {
        toppingsPrices += parseFloat(topping.product.unitPrice) * quantity;
      });
      const productCost = parseFloat(product.unitPrice) * quantity;
      const totalCost = productCost + toppingsPrices;

      return {
        uuid: uuidv4(),
        id: product.id,
        size: product.categorySize ? product.categorySize.name : "",
        unitPrice: product.unitPrice,
        imageUrl: product.imageUrl,
        name: product.name,
        quantity: quantity,
        toppings: toppings || [],
        totalCost: totalCost,
      };
    });

    if (analyticsService && analyticsService.trackAddToCart) {
      analyticsService.trackAddToCart(cartItems);
    }

    addToCart(cartItems, () => {
      this.openToaster("success", `Successfully added to your cart`);
    });
  };
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { toaster } = this.state;
    const { goBack, activeOrderDetails } = this.props;
    const { createdAt, order_items, deliveryLocation, grandTotal } =
      activeOrderDetails || {};

    if (!activeOrderDetails || !Object.keys(activeOrderDetails).length)
      return <Loader />;

    return (
      <div className="cart-container full-height">
        <div className="cart-header">
          <div
            className="container"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <div className="back" onClick={goBack}>
              <RightArrow />
            </div>
            <div className="title">{moment(createdAt).format("DD/MM/YY")}</div>
          </div>
        </div>
        <div className="cart-content">
          <div className="cart-items">
            <div className="title">
              <div className="container">ITEM</div>
            </div>
            {order_items?.map((cartItem, index) => {
              const { quantity, toppings, product } = cartItem;

              let toppingsPrices = 0;

              toppings.forEach((topping) => {
                toppingsPrices +=
                  parseFloat(topping.product.unitPrice) * quantity;
              });

              const productCost = product.unitPrice * quantity;

              const totalCost = productCost + toppingsPrices;

              return (
                <div key={`cart-item-${index}`} className="cart-item">
                  <div className="container">
                    <div className="image">
                      <img
                        src={
                          product.imageUrl ||
                          "/static/svgs/image-placeholder.svg"
                        }
                        alt=""
                      />
                    </div>
                    <div className="info">
                      <div className="main-description">
                        <span className="name ellipsis">{product.name}</span>
                        <span className="price">
                          ₦ {(totalCost || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="mini-description">
                        <span className="name ellipsis">
                          {product.categorySize.name} (x{quantity})
                        </span>
                        <span className="price">
                          ₦{product.unitPrice.toLocaleString()} x {quantity}
                        </span>
                      </div>
                      {(toppings || []).map((topping, index) => (
                        <div
                          key={`topping-${index}`}
                          className="mini-description"
                        >
                          <span className="name ellipsis">
                            {topping.product.name} (x{quantity})
                          </span>
                          <span className="price">
                            ₦{topping.product.unitPrice.toLocaleString()} x{" "}
                            {quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {deliveryLocation && deliveryLocation.address && (
            <div className="sub-total">
              <div
                className="container"
                style={{ flexDirection: "column", alignItems: "flex-start" }}
              >
                <span className="title">Delivery address:</span>
                <span
                  className="delivery-value"
                  style={{ wordBreak: "break-word" }}
                >
                  {deliveryLocation?.address}
                </span>
              </div>
            </div>
          )}
          <div className="sub-total">
            <div className="container">
              <span className="title">Sub Total</span>
              <span className="value">₦ {grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div
          className="reorder-action-container"
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "20px",
            paddingBottom: "40px",
          }}
        >
          <button
            onClick={this.reorderAction}
            style={{
              width: "max-content",
              padding: "16px 32px",
              backgroundColor: "#F4C029",
              color: "#000",
              border: "none",
              borderRadius: "2em",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            Re-order Items
          </button>
        </div>

        {toaster.status === "success" && (
          <Modal closeModal={this.closeToaster}>
            <div className="add-cart-success">
              <div className="icon">
                <ModalBread />
              </div>
              <div className="message">{toaster.message}</div>
              <div className="actions">
                <button
                  className="continue"
                  onClick={() => {
                    this.props.router.push("/cart");
                  }}
                >
                  Checkout
                </button>
                <button
                  className="go-checkout"
                  onClick={() => {
                    this.props.router.push("/");
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </Modal>
        )}

        {toaster.status === "error" && (
          <Toaster {...toaster} closeToaster={this.closeToaster} />
        )}
      </div>
    );
  }
}

export default CartConsumer(withRouter(OrderDetails));
