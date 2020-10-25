import { Component } from "react";
import classNames from "classnames";
import * as shallowequal from "shallowequal";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";

import { CartConsumer } from "../../providers/CartProvider";

import NumberSelector from "../FormElements/NumberSelector";
import { ToppingsForm } from "./";

import { RightArrow } from "../../public/static/vectors";
import { reduceLinearArray } from "../../utils/functions";
import Toaster from "../Toaster";

class ShopItemDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedSize: "Regular",
      quantity: 1,
      selectedToppings: [],
      isToppingsFormActive: false
    };
  }

  selectSize = selectedSize => {
    this.setState({
      selectedSize
    });
  };

  handleQuantity = quantity => {
    this.setState({
      quantity
    });
  };

  toggleToppingsForm = () => {
    this.setState({
      isToppingsFormActive: !this.state.isToppingsFormActive
    });
  };

  handleToppingsSelection = (topping, { target }) => {
    let selectedToppings = JSON.parse(
      JSON.stringify({...this.state.selectedToppings, quantity: 1})
    );

    if (target.checked) {
      selectedToppings.push(topping);
    } else {
      selectedToppings = selectedToppings.filter(({ id }) => id !== topping.id);
    }

    this.setState({
      selectedToppings
    });
  };

  cartAction = () => {
    const { selectedSize, selectedToppings, quantity } = this.state;
    const { addToCart, updateCart, goBack } = this.props;

    const { id, name, unitPrice } = this.getSelectedItemDetails();

    const cartItem = {
      id,
      name,
      unitPrice,
      size: selectedSize,
      toppings: selectedToppings,
      quantity,
      totalCost: this.getTotalCost()
    };

    const inCart = this.checkCart(id);

    inCart
      ? updateCart(cartItem, () => {
          this.openToaster(
            "success",
            `Updated ${name} x${quantity} in the cart successfully`
          );
          goBack();
        })
      : addToCart(cartItem, () => {
          this.openToaster(
            "success",
            `Added ${name} x${quantity} successfully to the cart`
          );
          goBack();
        });
  };

  getSelectedItemDetails = () => {
    const { selectedSize } = this.state;
    const { selectedItem } = this.props;

    return selectedItem
      ? selectedItem[selectedSize] && selectedItem[selectedSize].length
        ? selectedItem[selectedSize][0]
        : selectedItem
      : {};
  };

  getTotalCost = () => {
    let totalCost = 0;
    const { quantity, selectedToppings } = this.state;

    const { unitPrice } = this.getSelectedItemDetails();

    const toppingsPrices = selectedToppings.map(topping => topping.unitPrice);

    const toppingsTotalCost = reduceLinearArray(toppingsPrices);
    totalCost = toppingsTotalCost + parseFloat(unitPrice) * quantity;

    return totalCost;
  };

  openToaster = (status, message) => {
    this.setState({
      toaster: {
        status,
        message
      }
    });
  };

  closeToaster = () => {
    this.setState({
      toaster: null
    });
  };

  checkCart = itemId => {
    const inCart = this.props.cart.find(({ id }) => id === itemId);

    return inCart;
  };

  componentDidUpdate(prevProps) {
    const { selectedItem } = this.props;

    if (!shallowequal(prevProps.selectedItem, selectedItem)) {
      const inCart = this.checkCart(selectedItem.id);
      const { quantity, toppings, size } = inCart || {};

      inCart
        ? this.setState({
            quantity,
            selectedToppings: toppings,
            selectedSize: size
          })
        : this.setState({
            quantity: 1,
            selectedToppings: [],
            selectedSize: "Regular"
          });
    }
  }

  render() {
    const {
      selectedSize,
      quantity,
      isToppingsFormActive,
      selectedToppings,
      toaster
    } = this.state;
    const { selectedItem, goBack } = this.props;

    const {
      image,
      name,
      unitPrice,
      description,
      toppings
    } = this.getSelectedItemDetails();

    const sizes = ["Regular", "Mini", "Maxi"];

    const inCart = this.checkCart(selectedItem.id);

    return (
      <div className="shop-item-details">
        <div className="item-image">
          <img src="/static/images/banana-bread.jpg" alt="" />
          <span className="back" onClick={goBack}>
            <RightArrow />
          </span>
        </div>
        <div className="item-info">
          <div className="container">
            <div className="name-price">
              <span className="name">{name}</span>
              <span className="price">
                ₦ {unitPrice && unitPrice.toLocaleString()}
              </span>
            </div>
            <div className="description">{description}</div>
          </div>
        </div>
        <div className="select-section sizes-section">
          <div className="container">
            <span className="title">SELECT SIZE</span>
            <div className="sizes">
              {sizes.map((size, index) => (
                <span
                  key={`size-${index}`}
                  className={classNames("size-selector", {
                    active: selectedSize === size,
                    disabled: selectedItem[selectedSize] && !selectedItem[selectedSize].length
                  })}
                  onClick={() => this.selectSize(size)}
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="select-section">
          <div className="container">
            <span className="title">QUANTITY</span>
            <div className="quantity">
              <NumberSelector
                value={quantity}
                onChange={e => this.handleQuantity(e.target.value)}
              />
              <span
                className={classNames("add-toppings", {
                  active: selectedToppings.length,
                  disabled: !toppings || (toppings && !toppings.length)
                })}
                onClick={this.toggleToppingsForm}
              >
                {selectedToppings.length
                  ? `${selectedToppings.length} TOPPINGS`
                  : "ADD TOPPINGS"}
              </span>
            </div>
          </div>
        </div>
        <div className="add-to-cart" onClick={this.cartAction}>
          <div className="container">
            {inCart ? (
              <span>Update order</span>
            ) : (
              <span>Add {quantity} to Order</span>
            )}
            <div>
              <span className="total-price">
                ₦ {this.getTotalCost().toLocaleString()}
              </span>
              <RightArrow />
            </div>
          </div>
        </div>
        <CSSTransitionGroup
          transitionName="toppings-overlay-animation"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          {isToppingsFormActive && (
            <div className="toppings-form-overlay"></div>
          )}
        </CSSTransitionGroup>
        <CSSTransitionGroup
          transitionName="toppings-form-animation"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          {isToppingsFormActive && (
            <ToppingsForm
              key={`toppings-form-1`}
              toppings={toppings}
              closeToppingsForm={this.toggleToppingsForm}
              handleToppingsSelection={this.handleToppingsSelection}
              selectedToppings={selectedToppings}
            />
          )}
        </CSSTransitionGroup>

        {toaster && <Toaster {...toaster} closeToaster={this.closeToaster} />}
      </div>
    );
  }
}

export default CartConsumer(ShopItemDetails);
