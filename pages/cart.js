import { useState } from "react";
import classNames from "classnames";

import { CartConsumer } from "../providers/CartProvider";

import Main from "../layouts/Main";
import { Cart, Checkout, CheckoutSuccess } from "../components/Cart";

const CartPage = () => {
  const [isCheckoutActive, showCheckout] = useState(false);
  const [isCheckoutSuccessActive, showCheckoutSuccess] = useState(false);

  return (
    <Main>
      {isCheckoutSuccessActive ? (
        <CheckoutSuccess />
      ) : (
        <div className="swipe-container">
          <div
            className={classNames("swiper", { showCheckout: isCheckoutActive })}
          >
            <Cart checkout={() => showCheckout(true)} />
            <Checkout
              goBack={() => showCheckout(false)}
              showCheckoutSuccess={showCheckoutSuccess}
            />
          </div>
        </div>
      )}
    </Main>
  );
};

export default CartConsumer(CartPage);
