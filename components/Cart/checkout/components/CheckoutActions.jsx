import React from "react";
import * as classNames from "classnames";
import { RightArrow } from "../../../../public/static/vectors";
import { DELIVERY_METHODS } from "../constants/checkoutConstants";
import { isNoDiscountDate } from "../../../../constants";

const CheckoutActions = ({
  subTotal,
  deliveryCost,
  finalAmount,
  shippingMethod,
  chosenCity,
  deliveryDiscount,
  deliveryDiscountObject,
  isCheckingOut,
  isLoadingDeliveryPrice,
  priceCheck,
  cannotCheckout,
  isFormValid,
  onCheckout,
}) => {
  const isDeliveryMethod = DELIVERY_METHODS.includes(shippingMethod);
  const discountAmount = subTotal + deliveryCost - finalAmount;

  const chosenCityPrice = isNoDiscountDate(new Date())
    ? chosenCity?.price + 1000
    : chosenCity?.price;

  const isCheckoutDisabled =
    !priceCheck ||
    !isFormValid ||
    isCheckingOut ||
    isLoadingDeliveryPrice ||
    cannotCheckout ||
    (isDeliveryMethod && Object.entries(chosenCity).length === 0);

  return (
    <div className="cart-actions no-margin fixed">
      {deliveryCost >= 0 && isDeliveryMethod && (
        <DeliveryFeeNotice
          deliveryDiscountObject={deliveryDiscountObject}
          chosenCityPrice={chosenCityPrice}
          deliveryCost={deliveryCost}
          deliveryDiscount={deliveryDiscount}
        />
      )}

      <div
        className={classNames("checkout-button", { disabled: isCheckoutDisabled })}
        onClick={isCheckoutDisabled ? undefined : onCheckout}
      >
        <div className="container">
          <span>
            {isCheckingOut ? "Paying..." : "Pay"} ₦{finalAmount.toLocaleString()}
            {discountAmount > 0 && (
              <small style={{ marginLeft: "10px" }}>
                <strike>₦{(subTotal + deliveryCost).toLocaleString()}</strike>
              </small>
            )}
          </span>
          <RightArrow />
        </div>
      </div>
    </div>
  );
};

const DeliveryFeeNotice = ({
  deliveryDiscountObject,
  chosenCityPrice,
  deliveryCost,
  deliveryDiscount,
}) => {
  const hasDiscount = deliveryDiscountObject?.id && chosenCityPrice;
  const isFullyDiscounted = chosenCityPrice <= deliveryDiscount;
  const discountedPrice = chosenCityPrice - deliveryDiscount;

  return (
    <div className="delivery-fees-notice">
      <div className="container">
        <span className="icon">
          <img src="/static/images/delivery.png" alt="" />
        </span>
        <span className="text">
          {hasDiscount ? (
            <>
              <strike>₦{chosenCityPrice.toLocaleString()}</strike>
              &nbsp;
              {isFullyDiscounted && (
                <>₦{deliveryDiscountObject.price.toLocaleString()}</>
              )}
              {!isFullyDiscounted && (
                <>Shipping discount applied. Fee reduced to ₦{discountedPrice.toLocaleString()}</>
              )}
            </>
          ) : (
            <>₦{deliveryCost.toLocaleString()}</>
          )}
          {(!hasDiscount || isFullyDiscounted) && (
            <>&nbsp;will be charged for delivery</>
          )}
        </span>
      </div>
    </div>
  );
};

export default CheckoutActions;