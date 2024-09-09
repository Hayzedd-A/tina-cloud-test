import { useEffect, useState } from "react";

import { CartConsumer } from "../providers/CartProvider";
import Toaster from "../components/Toaster";

import Main from "../layouts/Main";
import { Cart, Checkout, CheckoutSuccess } from "../components/Cart";
import { getRequest } from "../api";
import { STORE_ID } from "../constants";
import Modal from "../components/Modal";
import { ModalBread } from "../public/static/vectors";
import { reduceArray } from "../utils/functions";

import axios from "axios";
import { API_BASE_URL } from "../constants";

const CartPage = ({ cart }) => {
  const [isCheckoutActive, showCheckout] = useState(false);

  // const [modalOpen, setModalOpen] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [testFlows, setTestFlow] = useState(false);
  const [isCheckoutSuccessActive, showCheckoutSuccess] = useState(false);
  const [toaster, setToaster] = useState(null);
  const [couponObject, setCouponObject] = useState(null);
  const [couponCode, setCouponCode] = useState({
    value: "",
    valid: false,
  });

  const [loyaltyPointsAvailable, setLoyaltyPointsAvailable] = useState(null);
  const [loyaltyPointApplied, setLoyaltyPointApplied] = useState({
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

  useEffect(() => {
    if (!cart?.length) return
    if (!loyaltyPointApplied?.value || !loyaltyPointsAvailable?.available) return
    const subTotal = reduceArray(cart, "totalCost");
    const loyaltyDiscount = parseFloat(loyaltyPointApplied.value)
    if (
      loyaltyDiscount > subTotal
    ) {
      setLoyaltyPointApplied({
        ...loyaltyPointApplied,
        value: subTotal
      });
      openToaster("error", "You can not redeem more points than order amount");
    } else if (loyaltyDiscount > (loyaltyPointsAvailable.available * loyaltyPointsAvailable.discountPerPoint)) {
      setLoyaltyPointApplied({
        ...loyaltyPointApplied,
        value: loyaltyPointsAvailable.available * loyaltyPointsAvailable.discountPerPoint
      });
      openToaster("error", "You can not redeem more discount than available");
    }

  }, [loyaltyPointApplied])

  const handleChangeLoyaltyPoints = ({ target }, valid) => {
    setLoyaltyPointApplied({
      value: isNaN(target.value) ? "" : target.value,
      valid,
    });
  };

  useEffect(() => {
    getLoyaltyDiscountAvailable()
  }, [])

  const getLoyaltyDiscountAvailable = async () => {
    const { value } = couponCode;
    try {
      const res = await getRequest({
        url: `/customer-requests/stores/${STORE_ID}/loyalty-points-available`,
        token: true
      });
      setLoyaltyPointsAvailable((res.data?.length ? res.data[0] : null));
    } catch (error) {
      console.log(`LOYALTY POINTS NOT FETCHED BECAUSE NOT LOGGED IN`)
      // const message = getRequestError(error);
      // openToaster("error", "An error occurred, please try again later");
    }
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

  const initiateCheckoutFacebookPixel = async _ => {

    const subTotal = reduceArray(cart, "totalCost");

    await axios.post(`${API_BASE_URL}auth/customer/facebook-pixel-api`, {
      "data": [
        {
          "event_name": "InitiateCheckout",
          "event_time": new Date().getTime(),
          "action_source": "website",
          "user_data": {
            "em": [
              "7b17fb0bd173f625b58636fb796407c22b3d16fc78302d79f0fd30c2fc2fc068"
            ],
            "ph": [
              null
            ]
          },
          "custom_data": {
            "currency": "N",
            "value": subTotal
          }
        }
      ]
    });
  }

  return (
    <Main>
      {modalOpen && (
        <Modal closeModal={closeModal}>
          <div className="add-cart-success">
            <div className="icon">
              <ModalBread />
            </div>

            <div className="message">
              We are fully booked for delivery on Feb 14. Orders placed now will be processed on the 15th.
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
          loyaltyPointsAvailable={loyaltyPointsAvailable}
          loyaltyPointApplied={loyaltyPointApplied}
          showCheckoutSuccess={showCheckoutSuccess}
        />
      ) : (
        <Cart
          loyaltyPointApplied={loyaltyPointApplied}
          loyaltyPointsAvailable={loyaltyPointsAvailable}
          couponCode={couponCode}
          couponObject={couponObject}
          checkout={() => {
            initiateCheckoutFacebookPixel()
            showCheckout(true)
          }}
          handleChangeLoyaltyPoints={handleChangeLoyaltyPoints}
          handleApplyCouponCode={handleApplyCouponCode}
          handleChangeCouponCode={handleChangeCouponCode}
        />
      )}
      {toaster && <Toaster {...toaster} closeToaster={closeToaster} />}
    </Main>
  );
};

export default CartConsumer(CartPage);
