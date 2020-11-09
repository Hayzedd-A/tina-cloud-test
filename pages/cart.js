import { useState } from "react";

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
      ) : isCheckoutActive ? (
        <Checkout
          goBack={() => showCheckout(false)}
          showCheckoutSuccess={showCheckoutSuccess}
        />
      ) : (
        <Cart checkout={() => showCheckout(true)} />
      )}
    </Main>
  );
};

export default CartConsumer(CartPage);
