import { Component } from "react";
import { withRouter } from "next/router";
import classNames from "classnames";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";


import { CartConsumer } from "../../providers/CartProvider";

import { NumberSelector } from "../FormElements";

import { RightArrow, EmptyCart } from "../../public/static/vectors";
import { reduceArray, reduceLinearArray } from "../../utils/functions";
import { HeaderMenu } from "../Header";

class Cart extends Component {

  state = {
    isMenuActive: false
  }

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

    // console.log(quantity);

    quantity === 0
      ? removeFromCart(item)
      : updateCart({ ...item, quantity, toppings, totalCost });
  };

  showMenu = (isMenuActive) => {
    this.setState({ isMenuActive })
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { isLoadingCart, cart, checkout, router } = this.props;
    const { isMenuActive } = this.state;
    console.log(cart)

    const subTotal = reduceArray(cart, "totalCost");

    // return <div>Hello</div>
    return (
      <div className="cart-container full-height">
        <div className="cart-header">
          <div className="container login-header-inner" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div
              className="back"
              onClick={() =>
                router.push(`/`, undefined, {
                  shallow: true
                })
              }
            >
              <RightArrow />
            </div>
            <div className="title">My Cart</div>
            <div
              className="header-icon-container hamburger-menu right-menu"
              style={{ top: '-12px' }}
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
                      toppings
                    } = cartItem;

                    return (
                      <div key={`cart-item-${index}`} className="cart-item">
                        <div className="container">
                          <div className="image">
                            <img src={imageUrl || "/static/svgs/image-placeholder.svg"} alt="" />
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
                              onChange={e =>
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
                <div className="sub-total">
                  <div className="container">
                    <span className="title">Sub Total</span>
                    <span className="value">₦ {subTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="cart-actions no-margin fixed">
                <div
                  className={classNames("checkout-button", {
                    disabled: !cart.length || subTotal < 2500
                  })}
                  onClick={(subTotal >= 2500) && checkout}
                >
                  <div className="container" style={{textAlign: 'center', padding: '0px 20px', lineHeight: '20px'}}>
                    {
                      (subTotal >= 2500) 
                        ? <span>Checkout</span>
                        : <span style={{fontSize: '.7em'}}>Oops! Minimum order value is N2,500. Please add more items.</span>
                    }
                    {(subTotal >= 2500) && <RightArrow />}
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

export default CartConsumer(withRouter(Cart));
