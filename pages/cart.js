import { useState } from "react";

import { CartConsumer } from "../providers/CartProvider";
import Toaster from "../components/Toaster";

import Main from "../layouts/Main";
import { Cart, Checkout, CheckoutSuccess } from "../components/Cart";
import { getRequest } from "../api";
import { STORE_ID } from "../constants";

const CartPage = () => {
  const [isCheckoutActive, showCheckout] = useState(false);
  const [isCheckoutSuccessActive, showCheckoutSuccess] = useState(false);
  const [toaster, setToaster] = useState(null);
  const [couponObject, setCouponObject] = useState(null);
  const [couponCode, setCouponCode] = useState({
    value: "",
    valid: false
  });

  const openToaster = (status, message) => {
    setToaster({
        status,
        message
    });
  };

  const closeToaster = () => {
    setToaster(null);
  };

  const handleChangeCouponCode = ({ target }, valid) => {
    setCouponCode({
      value: target.value,
      valid
    });
  };

  const handleApplyCouponCode = async() => {
    const { value } = couponCode;
    try {
      const res = await getRequest({
        url:
        `/customer-requests/stores/${STORE_ID}/coupons/${value}`
      });
      setCouponObject(res.data.data)
      if (!res.data.data) {
        openToaster("error", "Coupon does not exist");
      }
    } catch (error) {
      console.log(error);
      // const message = getRequestError(error);

      openToaster("error", "An error occurred, please try again later");
    }
  }

  return (
    <Main>
      {isCheckoutSuccessActive ? (
        <CheckoutSuccess />
      ) : isCheckoutActive ? (
        <Checkout
          goBack={() => showCheckout(false)}
          couponObject={couponObject}
          showCheckoutSuccess={showCheckoutSuccess}
        />
      ) : (
        <Cart 
          couponCode={couponCode}
          couponObject={couponObject}
          checkout={() => showCheckout(true)} 
          handleApplyCouponCode={handleApplyCouponCode}
          handleChangeCouponCode={handleChangeCouponCode}
        />
      )}
      {toaster && <Toaster {...toaster} closeToaster={closeToaster} />}
    </Main>
  );
};

export default CartConsumer(CartPage);
