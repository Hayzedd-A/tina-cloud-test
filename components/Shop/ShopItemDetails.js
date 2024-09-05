import { Component, createRef, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import Link from "next/link";
import { withRouter } from "next/router";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import * as shallowequal from "shallowequal";
import { v4 as uuidv4 } from 'uuid';

import { ProductsConsumer } from "../../providers/ProductsProvider";
import { CartConsumer } from "../../providers/CartProvider";

import NumberSelector from "../FormElements/NumberSelector";
import { ToppingsForm } from "./";

import { RightArrow, ModalBread, ArrowRight } from "../../public/static/vectors";
// import ArrowRight from "../public/static/svg/arrow-right";

import { reduceLinearArray, reduceArray } from "../../utils/functions";
import Toaster from "../Toaster";
import Modal from "../Modal";
import { HeaderMenu } from "../Header";

class ShopItemDetails extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedItem: {},
      selectedSize: "",
      isToppingsFormActive: false,
      tempCart: [],
      toaster: {},
      loadingImg: true,
      isMenuActive: false,
      marketingJSON: null
    };
    this.counter = createRef(0);
    this.scrollContainerRef = createRef(null);
  }

  setLoading = (value) => {
    this.setState({ isMenuActive: value })
  }

  imageLoaded = () => {
    this.counter += 1;
    if (this.counter >= 1) {
      setLoading(false);
    }
  }

  selectSize = selectedSize => {
    this.setState({
      selectedSize
    });
  };

  handleQuantity = _quantity => {
    let quantity = ((_quantity === "") || isNaN(_quantity)) ? 0 : _quantity;
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

    console.log("tempCart: ", tempCart);
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
    const { addToCart, router } = this.props;
    const { name, id } = router.query;

    const cartItems = tempCart.filter(({ quantity }) => quantity);

    addToCart(cartItems, () => {
      name && id && this.selectItem(id);
      this.openToaster(
        "success",
        `Added x${this.getTotalQuantity()} ${this.getTotalQuantity() === 1 ? "item" : "items"
        } successfully to the cart`
      );
      this.setState({
        ...this.state,
        marketingJSON: {
          "data": [
            {
              "event_name": "AddToCart",
              "event_time": 1725525528,
              "action_source": "website",
              "user_data": {
                "em": "7b17fb0bd173f625b58636fb796407c22b3d16fc78302d79f0fd30c2fc2fc068",
                "ph": "d36e83082288d9f2c98b3f3f87cd317a31e95527cb09972090d3456a7430ad4d"
              },
              "custom_data": {
                "currency": "USD",
                "value": "142.52"
              }
            }
          ]
        }
      })
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

  getToppingsDetails = (selectedTopping) => {
    const { selectedSize } = this.state;
    const { sizes } = selectedTopping;

    console.log(selectedTopping, sizes[selectedSize][0]);
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

    console.log(totalCost, itemsPrices, itemsPricesTotal, toppingsPrices)

    return totalCost;
  };

  getTotalQuantity = () => {
    const totalQuantity = reduceArray(this.state.tempCart, "quantity");

    console.log("totalQuantity: ", totalQuantity);
    return isNaN(totalQuantity) ? 0 : totalQuantity;
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
      const activeSizes = selectedItem.sizes ? Object.keys(selectedItem.sizes).filter((item) => selectedItem.sizes[item] && selectedItem.sizes[item].length > 0) : [];
      this.setState(
        {
          selectedItem,
          selectedSize: activeSizes ? activeSizes[0] : ''
        },
        () => {
          console.log(selectedItem.sizes)
          this.setState({
            tempCart: Object.keys(selectedItem.sizes).filter((item) => {
              return selectedItem.sizes[item].length > 0;
            }).map(size => {
              const { id, name, unitPrice, imageUrl } = this.getSelectedItemDetails(size) || {};

              return {
                uuid: uuidv4(),
                id,
                size,
                unitPrice,
                imageUrl,
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

  showMenu = (isMenuActive) => {
    this.setState({ isMenuActive })
  }

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

  leftClick = () => {
    const element = this.scrollContainerRef.current;
    const elemDimensions = element && element.getBoundingClientRect();
    // setScrollContainerDimensions(elemDimensions);
    element.scrollLeft -= 300;
  }

  rightClick = () => {
    const element = this.scrollContainerRef.current;
    const elemDimensions = element && element.getBoundingClientRect();
    // setScrollContainerDimensions(elemDimensions);
    element.scrollLeft += 300;
  }

  render() {
    const { router } = this.props;
    const {
      selectedSize,
      isToppingsFormActive,
      toaster,
      selectedItem,
      isMenuActive
    } = this.state;
    const { sizes } = selectedItem;
    const activeSizes = sizes ? Object.keys(sizes).filter((item) => sizes[item] && sizes[item].length > 0) : [];

    const {
      imageUrl,
      name,
      unitPrice,
      description
    } = this.getSelectedItemDetails() || {};

    return (
      <div className="shop-item-details">
        <div className="item-image">
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
            <img
              src={imageUrl ? imageUrl : "/static/svgs/image-placeholder.svg"}
              alt=""
              rel="preload"
              onLoad={this.imageLoaded}
            />
            <Link href="/">
              <a>
                <span className="back">
                  <RightArrow />
                </span>
              </a>
            </Link>
            <div
              className="header-icon-container hamburger-menu right-menu"
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
        </div>
        <div className="item-info">
          <div className="container">
            <div className="name-price">
              <span className="name">{name}</span>
              <span className="price">₦ {unitPrice?.toLocaleString()}</span>
            </div>
            {/* <div className="description">{description}</div> */}
            <div className="description">
              {selectedItem?.description !== undefined
                ? selectedItem?.description.charAt(0).toUpperCase() +
                selectedItem?.description.slice(1)
                : ""}
            </div>
          </div>
        </div>
        <div className="select-section sizes-section">
          <div className="container" style={{ position: "relative" }}>
            <span className="title">SELECT SIZE</span>
            <div className="left-arrow" onClick={this.leftClick}>
              <ArrowRight style={{ transform: "rotate(180deg" }} />
            </div>
            <div className="sizes" ref={this.scrollContainerRef}>
              {activeSizes &&
                activeSizes.map((size, index) => (
                  <span
                    key={`size-${index}`}
                    className={classNames("size-selector", {
                      active: selectedSize === size,
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
            <div className="right-arrow" onClick={this.rightClick}>
              <ArrowRight />
            </div>
          </div>
        </div>
        <div className="select-section qty-section">
          <div className="container">
            <span className="title">QUANTITY</span>
            <div className="quantity">
              <NumberSelector
                value={this.checkQuantity()}
                onChange={(e) => this.handleQuantity(e.target.value)}
              />
            </div>
          </div>
        </div>

        {selectedItem.toppings && !!selectedItem.toppings.length && (
          <div className="select-section">
            <div className="container">
              <span className="title">EXTRAS</span>
              <div
                className={classNames("add-toppings", {
                  active: this.getSelectedToppings().length,
                })}
                onClick={this.toggleToppingsForm}
              >
                {this.getSelectedToppings().length
                  ? `${this.getSelectedToppings().length === 1
                    ? `${this.getSelectedToppings().length} TOPPING`
                    : `${this.getSelectedToppings().length} TOPPINGS`
                  }`
                  : "ADD TOPPINGS"}
              </div>
            </div>
          </div>
        )}
        <div className="item-footer">
          <div
            className={classNames("add-to-cart", {
              disabled: !this.getTotalQuantity(),
            })}
            onClick={this.cartAction}
          >
            <div className="container">
              {
                this.state.marketingJSON && <span style={{ display: "none" }} id="marketingJson">{JSON.stringify(this.state.marketingJSON)}</span>
              }
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
                <button
                  className="continue"
                  onClick={() => router.push("/cart")}
                >
                  Checkout
                </button>
                <button
                  className="go-checkout"
                  onClick={() => router.push("/")}
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

export default CartConsumer(ProductsConsumer(withRouter(ShopItemDetails)));
