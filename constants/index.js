// First-order discount — change these values as needed
export const FIRST_ORDER_COUPON_CODE = "WELCOME10";
export const FIRST_ORDER_DISCOUNT_PERCENT = 10;

// dev
// export const STORE_ID="ba629b0f-9749-4097-bfc7-825fdcfe6811";

// prod

const NO_DISCOUNT_DELIVERY_DATE = "2026-02-14"; // val day

export const isNoDiscountDate = (ts) =>
  new Date(ts).toDateString() ===
  new Date(NO_DISCOUNT_DELIVERY_DATE).toDateString();

export const STORE_ID = "8a7a28dc-b54d-4841-b949-efe60dbae709";
export const merchentRef = "ref_8d6cd1583f4ee33c29786a208d";

export const CHOWDECK_KEY =
  "sk_test_7869ea89f1b52e7b48b0606afeaa1f9e74755f1fb83c5b8106";
export const API_BASE_URL = "https://api.zupa.ng/";
// export const API_BASE_URL = "https://dev.api.zupa.ng/";
// export const API_BASE_URL = "http://localhost:3000/";
export const CHOWDECK_API_URL = `https://api.chowdeck.com/merchant/${merchentRef}`;
// export const ANALYTICS_API_BASE_URL = 'http://localhost:3000/'
export const ANALYTICS_API_BASE_URL = API_BASE_URL;
// export const paystack_env = "dev";
export const paystack_env = "prod";
export const FREE_DELIVERY_TRESHOLD = 25000;
export const DELIVERY_DISCOUNT = isNoDiscountDate(Date.now()) ? 0 : 3000;

export const KITCHEN_LOCATION = {
  latitude: "6.601838",
  longitude: "3.3514863",
};

// export const API_BASE_URL = "http://localhost:3000/";
// export const paystack_env = "dev";
