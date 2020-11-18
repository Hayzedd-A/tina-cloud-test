import { Component } from "react";

import { RightArrow } from "../../public/static/vectors";
import { reduceArray, reduceLinearArray } from "../../utils/functions";

class OrderDetails extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { isLoadingCart, cart, goBack } = this.props;

    const subTotal = reduceArray(cart, "totalCost");

    return (
      <div className="cart-container full-height">
        <div className="cart-header">
          <div className="back" onClick={goBack}>
            <RightArrow />
          </div>
          <div className="title">09/11/20</div>
        </div>
        {!isLoadingCart && (
          <>
            <div className="cart-content">
              <div className="cart-items">
                <div className="title">
                  <div className="container">ITEM</div>
                </div>
                {cart.map((cartItem, index) => {
                  const {
                    id,
                    name,
                    size,
                    quantity,
                    unitPrice,
                    totalCost,
                    toppings
                  } = cartItem;

                  return (
                    <div key={`cart-item-${index}`} className="cart-item">
                      <div className="container">
                        <div className="image">
                          <img src="/static/images/banana-bread.jpg" alt="" />
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
                              ₦{unitPrice.toLocaleString()} x {quantity}
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
                                ₦{topping.unitPrice.toLocaleString()} x{" "}
                                {topping.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="sub-total">
                <div className="container">
                  <span className="title">Sub Total</span>
                  <span className="value">₦ {subTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default OrderDetails;
