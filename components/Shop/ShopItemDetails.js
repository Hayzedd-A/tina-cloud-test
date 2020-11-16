import { Component } from "react";
import classNames from "classnames";
import Link from "next/link";
import { withRouter } from "next/router";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import * as shallowequal from "shallowequal";

import { ProductsConsumer } from "../../providers/ProductsProvider";
import { CartConsumer } from "../../providers/CartProvider";

import NumberSelector from "../FormElements/NumberSelector";
import { ToppingsForm } from "./";

import { RightArrow, ModalBread } from "../../public/static/vectors";
import { reduceLinearArray, reduceArray } from "../../utils/functions";
import Toaster from "../Toaster";
import Modal from "../Modal";

class ShopItemDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedItem: {},
      selectedSize: "",
      isToppingsFormActive: false,
      tempCart: [],
      toaster: {}
    };
  }

  selectSize = selectedSize => {
    this.setState({
      selectedSize
    });
  };

  handleQuantity = quantity => {
    let tempCart = JSON.parse(JSON.stringify(this.state.tempCart));

    const tempCartItem = tempCart.find(
      ({ size }) => size === this.state.selectedSize
    );

    tempCartItem.quantity = quantity;
    tempCartItem.toppings = tempCartItem.toppings.map(topping => ({
      ...topping,
      quantity
    }));

    const toppingsPrices = tempCartItem.toppings.map(
      ({ unitPrice }) => parseFloat(unitPrice) * quantity
    );

    tempCartItem.totalCost =
      parseFloat(tempCartItem.unitPrice) * quantity +
      reduceLinearArray(toppingsPrices);

    this.setState({
      tempCart
    });
  };

  toggleToppingsForm = () => {
    this.setState({
      isToppingsFormActive: !this.state.isToppingsFormActive
    });
  };

  handleToppingsSelection = (topping, { target }) => {
    let tempCart = JSON.parse(JSON.stringify(this.state.tempCart));

    const tempCartItem = tempCart.find(
      ({ size }) => size === this.state.selectedSize
    );

    const { quantity } = tempCartItem || {};

    let selectedToppings = JSON.parse(JSON.stringify(tempCartItem.toppings));

    if (target.checked) {
      selectedToppings.push({ ...topping, quantity });
    } else {
      selectedToppings = selectedToppings.filter(({ id }) => id !== topping.id);
    }

    tempCartItem.toppings = selectedToppings;

    const toppingsPrices = tempCartItem.toppings.map(
      ({ unitPrice }) => parseFloat(unitPrice) * quantity
    );

    tempCartItem.totalCost =
      parseFloat(tempCartItem.unitPrice) * quantity +
      reduceLinearArray(toppingsPrices);

    this.setState({
      tempCart
    });
  };

  cartAction = () => {
    const { tempCart } = this.state;
    const { addToCart } = this.props;

    const cartItems = tempCart.filter(({ quantity }) => quantity);

    addToCart(cartItems, () => {
      this.openToaster(
        "success",
        `Added x${this.getTotalQuantity()} ${
          this.getTotalQuantity() === 1 ? "item" : "items"
        } successfully to the cart`
      );
    });
  };

  getSelectedItemDetails = currentSize => {
    const { selectedSize, selectedItem } = this.state;
    const { sizes } = selectedItem;

    return sizes
      ? sizes[currentSize || selectedSize]
        ? sizes[currentSize || selectedSize][0]
        : {}
      : {};
  };

  getToppingsDetails = selectedTopping => {
    const { selectedSize } = this.state;
    const { sizes } = selectedTopping;

    return sizes ? (sizes[selectedSize] ? sizes[selectedSize][0] : {}) : {};
  };

  getTotalCost = () => {
    let totalCost = 0;
    const { tempCart } = this.state;

    const itemsPrices = tempCart.map(
      ({ unitPrice, quantity }) => parseFloat(unitPrice) * quantity
    );
    let toppingsPrices = 0;

    tempCart.forEach(({ toppings }) => {
      toppings.forEach(({ unitPrice, quantity }) => {
        toppingsPrices += parseFloat(unitPrice) * quantity;
      });
    });

    const itemsPricesTotal = reduceLinearArray(itemsPrices);

    totalCost = itemsPricesTotal + toppingsPrices;

    return totalCost;
  };

  getTotalQuantity = () => {
    const totalQuantity = reduceArray(this.state.tempCart, "quantity");

    return totalQuantity;
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
      toaster: {}
    });
  };

  checkCart = itemId => {
    const inCart = this.props.cart.find(({ id }) => id === itemId);

    return inCart;
  };

  checkQuantity = currentSize => {
    const { selectedSize, tempCart } = this.state;
    const currentQuantity = tempCart.find(
      ({ size }) => size === (currentSize || selectedSize)
    );

    return currentQuantity ? currentQuantity.quantity : 0;
  };

  getSelectedToppings = () => {
    const { selectedSize, tempCart } = this.state;
    const currentQuantity = tempCart.find(({ size }) => size === selectedSize);

    return currentQuantity ? currentQuantity.toppings : [];
  };

  formatProducts = callback => {
    const { products } = this.props;

    let allProducts = [];

    for (let i = 0; i < products.length; i++) {
      const element = JSON.parse(JSON.stringify(products[i]));

      element.products = element.products.map(product => ({
        ...product,
        toppings: element.toppings
      }));

      allProducts = allProducts.concat(element.products);
    }

    this.setState(
      {
        allProducts
      },
      () => {
        callback && callback();
      }
    );
  };

  selectItem = itemId => {
    const selectedItem = this.state.allProducts.find(({ id }) => id === itemId);

    if (selectedItem) {
      this.setState(
        {
          selectedItem,
          selectedSize: Object.keys(selectedItem.sizes)[0]
        },
        () => {
          this.setState({
            tempCart: Object.keys(selectedItem.sizes).map(size => {
              const { id, name, unitPrice } = this.getSelectedItemDetails(size);

              console.log(id, name, unitPrice);
              return {
                id,
                size,
                unitPrice,
                name,
                quantity: 0,
                toppings: []
              };
            })
          });
        }
      );
    }
  };

  componentDidMount() {
    const { router } = this.props;
    const { name, id } = router.query;

    this.formatProducts(() => {
      name && id && this.selectItem(id);
    });
  }

  componentDidUpdate(prevProps) {
    const { router, products } = this.props;
    const { name, id } = router.query;

    if (!shallowequal(prevProps.products, products) && products.length) {
      this.formatProducts(() => {
        this.selectItem(id);
      });
    }

    if (!shallowequal(prevProps.router, router) && name && id) {
      this.selectItem(id);
    }
  }

  render() {
    const { router } = this.props;
    const {
      selectedSize,
      isToppingsFormActive,
      toaster,
      selectedItem
    } = this.state;
    const { sizes } = selectedItem;

    const {
      imageUrl,
      name,
      unitPrice,
      description
    } = this.getSelectedItemDetails();

    return (
      <div className="shop-item-details">
        <div className="item-image">
          <img src={imageUrl} alt="" />
          <Link href="/">
            <a>
              <span className="back">
                <RightArrow />
              </span>
            </a>
          </Link>
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
              {sizes &&
                Object.keys(sizes).map((size, index) => (
                  <span
                    key={`size-${index}`}
                    className={classNames("size-selector", {
                      active: selectedSize === size
                    })}
                    onClick={() => this.selectSize(size)}
                  >
                    {size}
                    {!!this.checkQuantity(size) && (
                      <span className="cart-count">
                        {this.checkQuantity(size)}
                      </span>
                    )}
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
                value={this.checkQuantity()}
                onChange={e => this.handleQuantity(e.target.value)}
              />
            </div>
          </div>
        </div>
        {selectedItem.toppings && selectedItem.toppings.length && (
          <div
            className={classNames("add-toppings", {
              active: this.getSelectedToppings().length
            })}
            onClick={this.toggleToppingsForm}
          >
            {this.getSelectedToppings().length
              ? `${
                  this.getSelectedToppings().length === 1
                    ? `${this.getSelectedToppings().length} TOPPING`
                    : `${this.getSelectedToppings().length} TOPPINGS`
                }`
              : "ADD TOPPINGS"}
          </div>
        )}
        <div className="item-footer">
          <div
            className={classNames("add-to-cart", {
              disabled: !this.getTotalQuantity()
            })}
            onClick={this.cartAction}
          >
            <div className="container">
              <span>Add {this.getTotalQuantity()} to Order</span>
              <div>
                <span className="total-price">
                  ₦ {this.getTotalCost().toLocaleString()}
                </span>
                <RightArrow />
              </div>
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
              toppings={selectedItem.toppings}
              closeToppingsForm={this.toggleToppingsForm}
              handleToppingsSelection={this.handleToppingsSelection}
              selectedToppings={this.getSelectedToppings()}
              getToppingsDetails={this.getToppingsDetails}
            />
          )}
        </CSSTransitionGroup>

        {toaster.status === "success" && (
          <Modal closeModal={this.closeToaster}>
            <div className="add-cart-success">
              <div className="icon">
                <ModalBread />
              </div>
              <div className="message">{toaster.message}</div>
              <div className="actions">
                <div className="continue" onClick={() => router.push("/")}>
                  Continue Shopping
                </div>
                <div
                  className="go-checkout"
                  onClick={() => router.push("/cart")}
                >
                  Checkout
                </div>
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

export default CartConsumer(ProductsConsumer(withRouter(ShopItemDetails)));
