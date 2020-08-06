import { Component } from "react";
import classNames from "classnames";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";

import { CartConsumer } from "../../providers/CartProvider";

import NumberSelector from "../FormElements/NumberSelector";
import { ToppingsForm } from "./";

import { RightArrow } from "../../public/static/vectors";
import { reduceLinearArray } from "../../utils/functions";
import Toaster from "../Toaster";

const toppings = [
  {
    id: 1,
    name: "Peanut",
    price: "1000"
  },
  {
    id: 2,
    name: "Pecan",
    price: "2100"
  },
  {
    id: 3,
    name: "Almond",
    price: "1300"
  },
  {
    id: 4,
    name: "Raisins",
    price: "1100"
  },
  {
    id: 5,
    name: "Granola",
    price: "2400"
  },
  {
    id: 6,
    name: "Chocolate",
    price: "4400"
  }
];

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

  handleToppingsSelection = (toppingId, { target }) => {
    let selectedToppings = JSON.parse(
      JSON.stringify(this.state.selectedToppings)
    );

    if (target.checked) {
      selectedToppings.push(toppingId);
    } else {
      selectedToppings = selectedToppings.filter(
        topping => topping !== toppingId
      );
    }

    this.setState({
      selectedToppings
    });
  };

  addToCart = () => {
    const { selectedSize, selectedToppings, quantity } = this.state;
    const { selectedItem, addToCart, goBack } = this.props;
    const { name, price } = selectedItem;

    const cartItem = {
      name,
      price,
      size: selectedSize,
      toppings: selectedToppings,
      quantity,
      totalCost: this.getTotalCost()
    };

    addToCart(cartItem, () => {
      this.openToaster(
        "success",
        `Added ${name} x${quantity} successfully to the cart`
      );
      goBack();
    });
  };

  getTotalCost = () => {
    let totalCost = 0;
    const { quantity, selectedToppings } = this.state;
    const { price } = this.props.selectedItem;

    const toppingsPrices = selectedToppings.map(topping => {
      return toppings.find(t => t.id === topping).price;
    });

    const toppingsTotalCost = reduceLinearArray(toppingsPrices);
    totalCost = toppingsTotalCost + parseFloat(price) * quantity;

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

  render() {
    const {
      selectedSize,
      quantity,
      isToppingsFormActive,
      selectedToppings,
      toaster
    } = this.state;
    const { selectedItem, goBack } = this.props;
    const { image, name, price, description } = selectedItem;

    const sizes = ["Regular", "Mini", "Maxi", "Large"];

    return (
      <div className="shop-item-details">
        <div className="item-image">
          <img src={image} alt="" />
          <span className="back" onClick={goBack}>
            <RightArrow />
          </span>
        </div>
        <div className="item-info">
          <div className="container">
            <div className="name-price">
              <span className="name">{name}</span>
              <span className="price">₦ {price && price.toLocaleString()}</span>
            </div>
            <div className="description">{description}</div>
          </div>
        </div>
        <div className="select-section">
          <div className="container">
            <span className="title">SELECT SIZE</span>
            <div className="sizes">
              {sizes.map((size, index) => (
                <span
                  key={`size-${index}`}
                  className={classNames("size-selector", {
                    active: selectedSize === size
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
                  active: selectedToppings.length
                })}
                onClick={this.toggleToppingsForm}
              >
                {selectedToppings.length
                  ? `TOPPINGS (${selectedToppings.length})`
                  : "ADD TOPPINGS"}
              </span>
            </div>
          </div>
        </div>
        <div className="add-to-cart" onClick={this.addToCart}>
          <div className="container">
            <span>Add {quantity} to Order</span>
            <div>
              <span className="total-price">
                ₦ {this.getTotalCost().toLocaleString()}
              </span>
              <RightArrow />
            </div>
          </div>
        </div>
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
