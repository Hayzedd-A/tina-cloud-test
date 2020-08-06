import { Component } from "react";
import classNames from "classnames";
import { useRouter } from "next/router";

import { CartConsumer } from "../providers/CartProvider";

import Main from "../layouts/Main";
import { Cart, Checkout } from "../components/Cart";

class CartPage extends Component {
  state = {
    showCheckout: false
  };

  checkout = () => {
    this.setState({
      showCheckout: true
    });
  };

  backToCart = () => {
    this.setState({
      showCheckout: false
    });
  };

  goBack = () => {
    console.log(useRouter());
    // this.setState(
    //   {
    //     showDetails: false
    //   },
    //   () =>
    //     setTimeout(() => {
    //       this.setState({ selectedItem: {} });
    //     }, 300)
    // );
  };

  render() {
    const { showCheckout } = this.state;

    return (
      <Main>
        <div className="swipe-container">
          <div className={classNames("swiper", { showCheckout })}>
            <Cart checkout={this.checkout} />
            <Checkout goBack={this.backToCart} />
          </div>
        </div>
      </Main>
    );
  }
}

export default CartConsumer(CartPage);
