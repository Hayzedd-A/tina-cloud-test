import { useState } from "react";

import { CartConsumer } from "../providers/CartProvider";
import Toaster from "../components/Toaster";

import Main from "../layouts/Main";
import { Cart, Checkout, CheckoutSuccess } from "../components/Cart";
import { getRequest } from "../api";
import { STORE_ID } from "../constants";
import Modal from "../components/Modal";
import { ModalBread } from "../public/static/vectors";

const CartPage = () => {
  const [isCheckoutActive, showCheckout] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);
  const [testFlows, setTestFlow] = useState(false);
  const [isCheckoutSuccessActive, showCheckoutSuccess] = useState(false);
  const [toaster, setToaster] = useState(null);
  const [couponObject, setCouponObject] = useState(null);
  const [couponCode, setCouponCode] = useState({
    value: "",
    valid: false,
  });

  const openToaster = (status, message) => {
    setToaster({
      status,
      message,
    });
  };

  const closeToaster = () => {
    setToaster(null);
  };

  const handleChangeCouponCode = ({ target }, valid) => {
    setCouponCode({
      value: target.value,
      valid,
    });
  };

  const handleApplyCouponCode = async () => {
    const { value } = couponCode;
    try {
      const res = await getRequest({
        url: `/customer-requests/stores/${STORE_ID}/coupons/${value}`,
      });
      setCouponObject(res.data.data);
      if (!res.data.data) {
        openToaster("error", "Coupon does not exist");
      }
    } catch (error) {
      console.log(error);
      // const message = getRequestError(error);

      openToaster("error", "An error occurred, please try again later");
    }
  };

  const closeModal = () => {
    this.setState({
      toaster: {},
    });
  };

  return (
    <Main>
      {modalOpen && (
        <Modal closeModal={closeModal}>
          <div className="add-cart-success">
            <div className="icon">
              <ModalBread />
            </div>
            <div className="message">
              Happy New Years! Due to the holidays, all orders placed will be
              delivered on the 10th Of January 2023..
              <br />
              Thanks for your patronage.
            </div>

            <div className="actions">
              <button className="continue" onClick={() => setModalOpen(false)}>
                Ok
              </button>
            </div>
          </div>
        </Modal>
      )}
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
