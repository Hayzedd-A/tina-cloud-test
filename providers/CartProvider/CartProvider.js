import React, { Component } from "react";

import { postRequest } from "../../api";

import { getRequestError } from "../../utils/functions";

const CartContext = React.createContext();

class CartProvider extends Component {
  state = {
    cart: [],
    orderDetails: {},
    isLoadingCart: true,
    isAddingRemoteCart: false,
    cartOutcome: "",
    cartMessage: "",
    remoteCartOutcome: "",
    remoteCartMessage: "",
    remoteCartData: {}
  };

  resetState = () => {
    this.setState({
      cartMessage: "",
      cartOutcome: "",
      remoteCartOutcome: "",
      remoteCartMessage: "",
      remoteCartData: {}
    });
  };

  getCart = async () => {
    this.setState({
      isLoadingCart: true
    });

    try {
      const storedCart = await localStorage.getItem("gourmettwistcart");
      const cart = storedCart ? JSON.parse(storedCart) : [];

      this.setState({
        cart,
        isLoadingCart: false
      });
    } catch (error) {
      this.setState({
        isLoadingCart: false
      });
    }
  };

  addToCart = (items, success) => {
    const { cart } = this.state;
    let cartCopy = JSON.parse(JSON.stringify(cart));

    cartCopy = [...cartCopy, ...items];
    this.updateLocalCart(cartCopy, success);
  };

  addOrderDetails = (orderDetails, success) => {
    this.setState(
      {
        orderDetails
      },
      () => success && success()
    );
  };
  
  addRemoteCart = async data => {
    this.resetState();
    this.setState({
      isAddingRemoteCart: true
    });

    try {
      const res = await postRequest({
        url: 'orders',
        data
      });

      this.setState({
        isAddingRemoteCart: false,
        remoteCartOutcome: 'success',
        remoteCartData: res.data
      });
    } catch (error) {
      const message = getRequestError(error);

      this.setState({
        isAddingRemoteCart: false,
        remoteCartOutcome: 'error',
        remoteCartMessage: message
      });
    }
  };

  removeOrderDetails = () => {
    this.setState({
      orderDetails: {}
    });
  };

  updateCart = (item, success) => {
    const { cart } = this.state;
    const cartCopy = [...cart];

    const currentItem = cartCopy.find(cartItem => cartItem.uuid === item.uuid);
    const index = cartCopy.indexOf(currentItem);

    cartCopy[index] = item;

    this.updateLocalCart(cartCopy, success);
  };

  removeFromCart = ({ uuid }, success) => {
    const { cart } = this.state;
    let cartCopy = [...cart];
    cartCopy = cartCopy.filter(cartItem => cartItem.uuid !== uuid);

    console.log(cartCopy);

    this.updateLocalCart(cartCopy, success);
  };

  clearCart = () => {
    localStorage.removeItem("gourmettwistcart");
    this.setState({
      cart: []
    });
  };

  updateLocalCart = (cart, success) => {
    localStorage.setItem("gourmettwistcart", JSON.stringify(cart));
    this.setState({
      cart
    }, () => success && success());
  };

  // how can i get the location prop here?

  componentDidMount() {
    // console.log("location object", this.props.location);
    this.getCart();
  }

  render() {
    return (
      <CartContext.Provider
        value={{
          ...this.state,
          getCart: this.getCart,
          addToCart: this.addToCart,
          addOrderDetails: this.addOrderDetails,
          addRemoteCart: this.addRemoteCart,
          updateCart: this.updateCart,
          removeFromCart: this.removeFromCart,
          clearCart: this.clearCart
        }}
      >
        {this.props.children}
      </CartContext.Provider>
    );
  }
}

const CartConsumer = Component => {
  return class Consumer extends React.Component {
    static getInitialProps(ctx) {
      return Component.getInitialProps ? Component.getInitialProps(ctx) : {};
    }

    render() {
      return (
        <CartContext.Consumer>
          {data => <Component {...this.props} {...data} />}
        </CartContext.Consumer>
      );
    }
  };
};

export default CartProvider;
export { CartConsumer };