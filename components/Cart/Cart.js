import { Component } from "react";
import Link from "next/link";

import { CartConsumer } from "../../providers/CartProvider";

import { NumberSelector } from "../FormElements";

import { RightArrow } from "../../public/static/vectors";
import { reduceArray, reduceLinearArray } from "../../utils/functions";

class Cart extends Component {
  cartAction = (item, quantity) => {
    const { updateCart, removeFromCart } = this.props;
    const { unitPrice } = item;

    let toppings = JSON.parse(JSON.stringify(item.toppings));

    toppings = toppings.map(topping => ({
      ...topping,
      quantity
    }));

    const toppingsPrices = toppings.map(
      topping => parseFloat(topping.unitPrice) * quantity
    );

    const toppingsTotalCost = reduceLinearArray(toppingsPrices);
    const totalCost = toppingsTotalCost + parseFloat(unitPrice) * quantity;

    quantity
      ? updateCart({ ...item, quantity, toppings, totalCost })
      : removeFromCart(item);
  };

  render() {
    const { cart, checkout } = this.props;

    const subTotal = reduceArray(cart, "totalCost");

    return (
      <div className="cart-container">
        <div className="cart-header">
          <Link href="/">
            <a>
              <div className="back">
                <RightArrow />
              </div>
            </a>
          </Link>
          <div className="title">My Cart</div>
          <div className="info">
            <span className="icon">
              <img src="/static/images/lightning.png" alt="" />
            </span>
            <span className="text">
              Order within 6.30 mins to guarantee delivery today
            </span>
          </div>
        </div>
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
                    <NumberSelector
                      value={quantity}
                      onChange={e => this.cartAction(cartItem, e.target.value)}
                      className="small"
                    />
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
        <div className="cart-actions">
          <div className="delivery-fees-notice">
            <div className="container">
              <span className="icon">
                <img src="/static/images/delivery.png" alt="" />
              </span>
              <span className="text">
                Delivery Fees will be calculated in the next step!
              </span>
            </div>
          </div>
          <div className="checkout-button" onClick={checkout}>
            <div className="container">
              <span>Checkout</span>
              <RightArrow />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CartConsumer(Cart);
