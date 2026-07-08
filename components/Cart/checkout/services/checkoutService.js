import { postRequest, getUserDetails } from "../../../../api";
import { reduceArray, paystack } from "../../../../utils/functions";
import {
  isNoDiscountDate,
  FREE_DELIVERY_TRESHOLD,
  STORE_ID,
} from "../../../../constants";
import analyticsService from "../../../../services/analyticsService";

export const checkoutService = {
  /**
   * Prepare checkout payload
   */
  prepareCheckoutPayload({
    formValues,
    cart,
    deliveryCost,
    chosenCity,
    deliveryLocation,
    pickupLocation,
    couponObject,
    giftCardObject,
    deliveryDiscountObject,
    loyaltyPointApplied,
    storeId,
    tracking,
  }) {
    const {
      name,
      phoneNumber,
      address,
      email,
      note,
      shippingMethod,
      deliveryDate,
    } = formValues;

    const loggedInCustomer = getUserDetails()?.customer;

    const orderItems = cart.map(({ id, quantity, name, size, toppings }) => ({
      productId: id,
      name,
      size,
      quantity,
      toppings: toppings.map((topping) => ({
        productId: topping.id,
        quantity: topping.quantity || 1,
      })),
    }));

    const payload = {
      state: "lagos",
      city: chosenCity?.label,
      deliveryTypeId: chosenCity?.key,
      originalDeliveryTypeId: chosenCity?.key,
      specialNote: note,
      orderItems,
      customer: {
        name: loggedInCustomer?.name || name,
        phoneNumber: loggedInCustomer?.phoneNumber || phoneNumber,
        address: loggedInCustomer?.address || address,
        email: loggedInCustomer?.email || email,
      },
      recipient: {
        name,
        phoneNumber,
      },
      deliveryDate: deliveryDate || null,
      deliveryLocation,
    };

    // Handle pickup
    if (shippingMethod === "pickup" || shippingMethod === "s-pickup") {
      payload.pickupLocation = pickupLocation;
      payload.deliveryLocation = pickupLocation;
      payload.city = "Pickup";
    }

    // Handle coupon discount
    if (couponObject) {
      payload.discountType = couponObject.discountType;
      payload.discountValue = couponObject.value;
      payload.couponObject = couponObject;
    }

    // Handle gift card
    const subTotal = reduceArray(cart, "totalCost");
    const ttlGcDiscount = giftCardObject?.remainingValue || 0;

    let discountAmountGc =
      ttlGcDiscount > subTotal + deliveryCost
        ? subTotal + deliveryCost
        : ttlGcDiscount;

    if (giftCardObject) {
      payload.discountGcCode = giftCardObject.code;
      payload.discountValueGc = discountAmountGc;
    }

    // Handle loyalty points
    if (
      loyaltyPointApplied?.value &&
      discountAmountGc < subTotal + deliveryCost
    ) {
      let loyaltyPointsToRedeem = parseFloat(loyaltyPointApplied.value);

      if (
        parseFloat(ttlGcDiscount) + loyaltyPointsToRedeem >
        subTotal + deliveryCost
      ) {
        loyaltyPointsToRedeem =
          subTotal + deliveryCost - parseFloat(ttlGcDiscount);
      }

      payload.loyaltyPointsDiscountRedeemed = loyaltyPointsToRedeem;
      payload.loyaltyPointsRedeemed = loyaltyPointsToRedeem;
      // payload.loyaltyPointsRedeemed = Math.ceil(
      //   loyaltyPointsToRedeem / loyaltyPointApplied.discountPerPoint,
      // );
    }

    if (tracking) payload.tracking = tracking;

    return { ...payload, email };
  },

  /**
   * Process checkout
   */
  async processCheckout(checkoutData) {
    const { email, ...payload } = checkoutData;

    const response = await postRequest({
      url: `/customer-requests/stores/${STORE_ID}/placed-orders`,
      data: payload,
    });

    return response.data;
  },

  /**
   * Calculate final amount after discounts
   */
  calculateFinalAmount({
    subTotal,
    deliveryCost,
    chosenCity,
    deliveryDiscount,
    couponObject,
    giftCardObject,
    deliveryDiscountObject,
    loyaltyPointApplied,
  }) {
    const loyaltyDiscountApplied = parseFloat(loyaltyPointApplied?.value || 0);
    const ttlGcDiscount = giftCardObject?.remainingValue || 0;

    let discountAmount = 0;

    // Coupon discount
    if (couponObject) {
      discountAmount =
        couponObject.discountType === "percent"
          ? (couponObject.value * subTotal) / 100
          : couponObject.value;
    }

    // Delivery discount
    if (deliveryDiscountObject?.id) {
      discountAmount += deliveryCost;
      discountAmount -= deliveryDiscountObject?.price;
    }

    // Loyalty points discount
    if (loyaltyDiscountApplied) {
      discountAmount = (discountAmount || 0) + loyaltyDiscountApplied;
    }

    // Gift card discount
    if (ttlGcDiscount) {
      discountAmount = (discountAmount || 0) + ttlGcDiscount;
    }

    let finalAmount = subTotal + deliveryCost - (discountAmount || 0);

    if (discountAmount > subTotal + deliveryCost) {
      finalAmount = 0;
    }

    // Adjust for delivery discount on special dates
    const chosenCityPrice = isNoDiscountDate(new Date())
      ? chosenCity?.price + 1000
      : chosenCity?.price;

    if (chosenCityPrice > deliveryDiscount && deliveryDiscountObject?.id) {
      finalAmount += chosenCityPrice - deliveryDiscount;
    }

    return Math.max(finalAmount, 0);
  },

  /**
   * Initiate Paystack payment
   */
  initiatePayment(response, email, onSuccess, onClose) {
    const { paymentReference, amount } = response;

    const metadata = {
      storeID: STORE_ID,
    };

    paystack(
      email,
      paymentReference,
      parseFloat(amount === 0 ? 0.01 : amount) * 100,
      onSuccess,
      onClose,
      metadata,
    );
  },
};
