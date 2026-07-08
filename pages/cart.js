import { useEffect, useState, useCallback } from "react";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";

import { CartConsumer } from "../providers/CartProvider";
import Toaster from "../components/Toaster";

import Main from "../layouts/Main";
import { Cart, CheckoutSuccess } from "../components/Cart";
import Checkout from "../components/Cart/checkout/Checkout";
import { getRequest, postRequest, getUserDetails } from "../api";
import {
  STORE_ID,
  FIRST_ORDER_COUPON_CODE,
  FIRST_ORDER_DISCOUNT_PERCENT,
} from "../constants";
import Modal from "../components/Modal";
import { ModalBread } from "../public/static/vectors";
import { reduceArray } from "../utils/functions";

import moment from "moment";

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

  const [giftCardObject, setGiftCardObject] = useState(null);
  const [giftCardCode, setGiftCardCode] = useState({
    value: "",
    valid: false,
  });

  const [deliveryDiscountObject, setDeliveryDiscountObject] = useState(null);
  const [deliveryDiscountCode, setDeliveryDiscountCode] = useState({
    value: "GTFREE",
    valid: false,
  });

  const [loyaltyPointsAvailable, setLoyaltyPointsAvailable] = useState(null);
  const [loyaltyPointApplied, setLoyaltyPointApplied] = useState({
    value: "",
    valid: false,
  });

  const [phoneNumber, setPhoneNumber] = useState("");
  const [isCheckingFirstTimeUser, setIsCheckingFirstTimeUser] = useState(false);
  const [firstTimeChecked, setFirstTimeChecked] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(null);
  const [showFirstOrderModal, setShowFirstOrderModal] = useState(false);
  const [couponCopied, setCouponCopied] = useState(false);
  const [generatedCouponCode, setGeneratedCouponCode] = useState(null);

  const copyCouponCode = useCallback(async () => {
    const code = generatedCouponCode || FIRST_ORDER_COUPON_CODE;
    await navigator.clipboard.writeText(code);
    setCouponCopied(true);
    setTimeout(() => setCouponCopied(false), 2000);
  }, [generatedCouponCode]);

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
    if (!target?.value) {
      setCouponObject(null);
      return setCouponCode({
        value: "",
        valid: false,
      });
    }
    setCouponCode({
      value: target.value,
      valid,
    });
  };

  useEffect(() => {
    if (!cart?.length) return;
    if (!loyaltyPointApplied?.value || !loyaltyPointsAvailable?.available)
      return;
    const subTotal = reduceArray(cart, "totalCost");
    const loyaltyDiscount = parseFloat(loyaltyPointApplied.value);
    if (loyaltyDiscount > subTotal) {
      setLoyaltyPointApplied({
        ...loyaltyPointApplied,
        value: subTotal,
      });
      openToaster("error", "You can not redeem more points than order amount");
    } else if (
      loyaltyDiscount >
      loyaltyPointsAvailable.available * loyaltyPointsAvailable.discountPerPoint
    ) {
      setLoyaltyPointApplied({
        ...loyaltyPointApplied,
        value:
          loyaltyPointsAvailable.available *
          loyaltyPointsAvailable.discountPerPoint,
      });
      openToaster("error", "You can not redeem more discount than available");
    }
  }, [loyaltyPointApplied]);

  const handleChangeLoyaltyPoints = ({ target }, valid) => {
    setLoyaltyPointApplied({
      value: isNaN(target.value) ? "" : target.value,
      valid,
    });
  };

  useEffect(() => {
    getLoyaltyDiscountAvailable();
  }, []);

  const checkFirstTimeUser = async (phone) => {
    if (!phone) return;
    setIsCheckingFirstTimeUser(true);
    try {
      const res = await getRequest({
        url: `/customer-requests/stores/check-first-time-user?phoneNumber=${phone}`,
      });
      const isFirst = res.data?.isFirstTimeUser;
      setIsFirstTimeUser(isFirst);
      setFirstTimeChecked(true);
      if (isFirst) {
        try {
          const couponRes = await getRequest({
            url: `/customer-requests/stores/${STORE_ID}/coupon/new`,
            params: { couponType: "first_time_user" },
          });
          const code =
            couponRes.data?.code ||
            couponRes.data?.couponCode ||
            couponRes.data?.data?.code ||
            couponRes.data?.data?.couponCode;
          if (code) setGeneratedCouponCode(code);
        } catch {
          // coupon fetch failing should not block the flow
        }
        setShowFirstOrderModal(true);
      }
    } catch (error) {
      openToaster("error", "An error occurred, please try again later");
    } finally {
      setIsCheckingFirstTimeUser(false);
    }
  };

  const handlePhoneNumberChange = ({ target }) => {
    setPhoneNumber(target.value);
  };

  useEffect(() => {
    const user = getUserDetails();
    if (user?.customer?.phoneNumber) {
      checkFirstTimeUser(user.customer.phoneNumber);
    }
  }, []);

  const getLoyaltyDiscountAvailable = async () => {
    const { value } = couponCode;
    try {
      const res = await getRequest({
        url: `/customer-requests/stores/${STORE_ID}/loyalty-points-available`,
        token: true,
      });
      setLoyaltyPointsAvailable(res.data?.length ? res.data[0] : null);
    } catch (error) {
      console.log(`LOYALTY POINTS NOT FETCHED BECAUSE NOT LOGGED IN`);
      // const message = getRequestError(error);
      // openToaster("error", "An error occurred, please try again later");
    }
  };

  const handleApplyCouponCode = async () => {
    const { value } = couponCode;
    try {
      const welcomePhone = localStorage.getItem("gourmet-twist-welcome-phone");
      const res = await getRequest({
        url: `/customer-requests/stores/${STORE_ID}/coupons/${value}`,
        params: welcomePhone ? { phoneNumber: welcomePhone } : undefined,
      });
      console.log("coupon response: ", res.data);
      if (res.data.statusMessage !== "active") {
        openToaster("error", res.data.statusMessage);
        return;
      }
      setCouponObject(res.data.data);
    } catch (error) {
      console.log(error);
      openToaster("error", "An error occurred, please try again later");
    }
  };

  const handleChangeGiftCardCode = ({ target }, valid) => {
    if (!target?.value) {
      setGiftCardObject(null);
      return setGiftCardCode({
        value: "",
        valid: false,
      });
    }
    setGiftCardCode({
      value: target.value,
      valid,
    });
  };

  const handleApplyGCCode = async () => {
    const { value } = giftCardCode;
    try {
      const res = await getRequest({
        url: `/customer-requests/stores/${STORE_ID}/gift-card/${value}`,
      });
      if (!res.data.data || res?.data?.data?.remainingValue <= 0) {
        setGiftCardObject(null);
        return openToaster("error", "Gift card does not exist");
      }
      if (
        !moment().isBetween(
          moment(res.data.data.startDate),
          moment(res.data.data.endDate),
          "day",
          "[]",
        )
      ) {
        setGiftCardObject(null);
        return openToaster("error", "Gift card does not exist");
      }
      setGiftCardObject(res.data.data);
    } catch (error) {
      openToaster("error", "An error occurred, please try again later");
    }
  };

  const resetDeliveryDiscount = () => {
    setDeliveryDiscountObject(null);
    setDeliveryDiscountCode({
      value: "",
      valid: false,
    });
  };

  const handleChangeDeliveryDiscountCode = ({ target }, valid) => {
    if (!target?.value) {
      return resetDeliveryDiscount();
    }
    setDeliveryDiscountCode({
      value: target.value,
      valid,
    });
  };

  const handleApplyDCCode = async () => {
    const { value } = deliveryDiscountCode;
    try {
      const res = await getRequest({
        url: `/customer-requests/stores/${STORE_ID}/delivery-discount-code/GTFREE`,
      });
      if (!res.data.data) {
        setDeliveryDiscountObject(null);
        return openToaster("error", "Delivery discount code does not exist");
      }
      // openToaster("success", "Delivery discount applied");
      setDeliveryDiscountObject(res.data.data);
    } catch (error) {
      resetDeliveryDiscount();
      openToaster("error", "Invalid discount code applied");
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
              We are fully booked for delivery on Feb 14. Orders placed now will
              be processed on the 15th.
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

      {showFirstOrderModal && (
        <Modal closeModal={() => setShowFirstOrderModal(false)}>
          <div className="add-cart-success">
            <div className="icon">
              <ModalBread />
            </div>
            <div className="message">
              <strong>Welcome! You&apos;re a first-time customer.</strong>
              <br />
              Enjoy {FIRST_ORDER_DISCOUNT_PERCENT}% off your first order! Enter
              the coupon code below in your cart:
              {(generatedCouponCode || FIRST_ORDER_COUPON_CODE) && (
                <div
                  className="first-order-coupon-display"
                  onClick={copyCouponCode}
                  title="Click to copy"
                >
                  {generatedCouponCode || FIRST_ORDER_COUPON_CODE}
                  <span className="first-order-coupon-copy-icon">
                    {couponCopied ? (
                      <CheckOutlined style={{ color: "#52c41a" }} />
                    ) : (
                      <CopyOutlined />
                    )}
                  </span>
                </div>
              )}
            </div>
            <div className="actions">
              <button
                className="continue"
                onClick={() => setShowFirstOrderModal(false)}
              >
                Got it!
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
          giftCardObject={giftCardObject}
          deliveryDiscountObject={deliveryDiscountObject}
          loyaltyPointsAvailable={loyaltyPointsAvailable}
          loyaltyPointApplied={loyaltyPointApplied}
          showCheckoutSuccess={showCheckoutSuccess}
          cartPhoneNumber={phoneNumber}
        />
      ) : (
        <Cart
          loyaltyPointApplied={loyaltyPointApplied}
          loyaltyPointsAvailable={loyaltyPointsAvailable}
          giftCardCode={giftCardCode}
          giftCardObject={giftCardObject}
          deliveryDiscountCode={deliveryDiscountCode}
          deliveryDiscountObject={deliveryDiscountObject}
          couponCode={couponCode}
          couponObject={couponObject}
          checkout={() => showCheckout(true)}
          handleChangeLoyaltyPoints={handleChangeLoyaltyPoints}
          handleApplyCouponCode={handleApplyCouponCode}
          handleChangeCouponCode={handleChangeCouponCode}
          handleApplyGCCode={handleApplyGCCode}
          handleChangeGiftCardCode={handleChangeGiftCardCode}
          handleApplyDCCode={handleApplyDCCode}
          handleChangeDeliveryDiscountCode={handleChangeDeliveryDiscountCode}
          resetDeliveryDiscount={resetDeliveryDiscount}
          showCheckoutSuccess={showCheckoutSuccess}
          phoneNumber={phoneNumber}
          handlePhoneNumberChange={handlePhoneNumberChange}
          isCheckingFirstTimeUser={isCheckingFirstTimeUser}
          firstTimeChecked={firstTimeChecked}
          isFirstTimeUser={isFirstTimeUser}
          checkFirstTimeUser={checkFirstTimeUser}
          autoOpenCoupon={isFirstTimeUser === true}
          onShowFirstOrderModal={() => setShowFirstOrderModal(true)}
          firstOrderCouponCode={generatedCouponCode || FIRST_ORDER_COUPON_CODE}
          firstOrderDiscountPercent={FIRST_ORDER_DISCOUNT_PERCENT}
        />
      )}
      {toaster && <Toaster {...toaster} closeToaster={closeToaster} />}
    </Main>
  );
};

export default CartConsumer(CartPage);
