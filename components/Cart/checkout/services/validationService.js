import {
  isNoDiscountDate,
  FREE_DELIVERY_TRESHOLD,
} from "../../../../constants";
import {
  DELIVERY_METHODS,
  DEFAULT_DELIVERY_DISCOUNT,
} from "../constants/checkoutConstants";

export const validationService = {
  /**
   * Check if form is valid for checkout
   */
  checkFormValidity(formData, selectedPickup) {
    const { address, shippingMethod, ...rest } = formData;

    const isPickupValid =
      shippingMethod.value === "pickup" || shippingMethod.value === "s-pickup"
        ? selectedPickup !== ""
        : true;

    const isAddressValid = DELIVERY_METHODS.includes(shippingMethod.value)
      ? address.valid
      : true;

    return (
      Object.values(rest).every((value) => value.valid) &&
      isAddressValid &&
      isPickupValid
    );
  },

  /**
   * Patch form values with user data
   */
  patchFormValues(initialFormData, userData) {
    const patchedData = { ...initialFormData };

    Object.keys(patchedData).forEach((key) => {
      if (userData[key]) {
        patchedData[key] = {
          value: userData[key],
          valid: true,
        };
      }
    });

    return patchedData;
  },

  /**
   * Check if products in cart are available for selected date
   */
  checkProductAvailability(allowedCategories, cart, selectedDate) {
    if (!allowedCategories?.length || !isNoDiscountDate(selectedDate)) {
      return { cannotCheckout: false, excludedItems: [] };
    }

    const allowedProducts = allowedCategories
      .map((item) => item.products)
      .flat();

    if (!allowedProducts.length) {
      return { cannotCheckout: false, excludedItems: [] };
    }

    const allowedProductNames = allowedProducts.map(({ name }) => name);
    const cartItemNames = cart.map(({ name }) => name);

    const excludedItems = cartItemNames.filter(
      (name) => !allowedProductNames.includes(name),
    );

    return {
      cannotCheckout: excludedItems.length > 0,
      excludedItems,
    };
  },

  /**
   * Check if order is eligible for delivery discount
   */
  isDeliveryDiscountEligible(subTotal, deliveryCost, deliveryDiscount) {
    return (
      subTotal >= FREE_DELIVERY_TRESHOLD &&
      deliveryCost > DEFAULT_DELIVERY_DISCOUNT
    );
  },

  /**
   * Validate email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate phone number (11 digits)
   */
  isValidPhoneNumber(phoneNumber) {
    const cleanedNumber = phoneNumber.replace(/\D/g, "");
    return cleanedNumber.length === 11;
  },

  /**
   * Validate minimum order amount
   */
  isAboveMinimumAmount(amount, minimumAmount = 2500) {
    return amount >= minimumAmount;
  },
};
