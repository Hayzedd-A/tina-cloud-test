import { Component } from "react";
import * as moment from "moment";

import { RightArrow } from "../../public/static/vectors";
import { reduceArray, reduceLinearArray } from "../../utils/functions";

class OrderDetails extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { goBack, orderDetails } = this.props;
    const { createdAt, order_items, deliveryLocation, grandTotal } =
      orderDetails || {};

    return (
      <div className="cart-container full-height">
        <div className="cart-header">
          <div className="container" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
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
            {order_items.map((cartItem, index) => {
              const { quantity, toppings, product } = cartItem;

              let toppingsPrices = 0;

              toppings.forEach(topping => {
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
      </div>
    );
  }
}

export default OrderDetails;
