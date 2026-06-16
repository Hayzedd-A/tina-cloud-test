import * as moment from "moment";
import { paystack_env } from "../constants";
import analyticsService from "../services/analyticsService";

export const isClient = () => {
  return typeof window !== "undefined";
};

export const slugify = (text) => {
  return (
    text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      // eslint-disable-next-line
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      // eslint-disable-next-line
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, "")
  ); // Trim - from end of text
};

export const getFormValues = (formFields) => {
  if (!formFields || !(typeof formFields === "object") || formFields[0]) {
    return null;
  }

  let formValues = {};

  if (formFields.referralCode) delete formFields.referralCode;

  Object.keys(formFields).forEach((key) => {
    formValues[key] =
      typeof formFields[key] === "string"
        ? formFields[key].value.trim()
        : formFields[key].value;
  });

  return formValues;
};

export const getRequestError = (error) => {
  const { response } = error;
  if (response && response.data.code === 401) {
    logout();
    return "";
  } else if (response && response.data.errors && response.data.errors[0]) {
    return response.data.errors[0].message;
  } else if (response && response.data.message) {
    return response.data.message;
  }
  console.log(error);
  return "There might be a problem with your internet connection. Please check and try again.";
};

export const logout = () => {
  localStorage.removeItem("ghalib-user");
  window.scrollTo(0, 0);
  window.location.reload();
};

export const reduceArray = (array, reducer) => {
  // return array.reduce((prev, curr) => prev + parseFloat(curr[reducer]), 0);
  return array
    ? array.reduce((prev, curr) => prev + parseFloat(curr[reducer]), 0)
    : 0;
};

export const reduceLinearArray = (array) => {
  return array.reduce((prev, curr) => prev + parseFloat(curr), 0);
};

export const getDays = () => {
  const days = new Array(31).fill(0).map(({}, index) => {
    const day = ("0" + (index + 1).toString()).slice(-2);

    return {
      label: day,
      value: day,
    };
  });

  return days;
};

export const getMonths = () => {
  const months = new Array(12).fill(0).map(({}, index) => ({
    label: moment(index + 1, "M").format("MMMM"),
    value: moment(index + 1, "M").format("MM"),
  }));

  return months;
};

export const getYears = () => {
  const years = new Array(99).fill(0).map(({}, index) => {
    const year = (moment().format("YYYY") - index).toString();

    return {
      label: year,
      value: year,
    };
  });

  return years;
};

export const convertDateObjectToString = (date) => {
  let month = "" + (date.getMonth() + 1);
  let day = "" + date.getDate();
  let year = date.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

export const applyEllipsis = (text, limit) => {
  return text && text.length > limit ? `${text.substring(0, limit)}...` : text;
};

export const paystack = (
  email,
  ref,
  amount,
  handlePaystackSuccess,
  handlePaystackClose,
  metadata,
) => {
  analyticsService.trackEvent("paystack_intiated", {
    email,
    ref,
    amount,
    metadata,
  });
  try {
    // pk_live_42c6b07dfc9fd32654d4cc9fd39b08a031ac8826
    // pk_test_54ed04488bcc1a192bd2406fd36cfd8596e3ccae
    const handler = window.PaystackPop.setup({
      key:
        paystack_env !== "dev"
          ? "pk_live_42c6b07dfc9fd32654d4cc9fd39b08a031ac8826"
          : "pk_test_54ed04488bcc1a192bd2406fd36cfd8596e3ccae",
      email,
      amount,
      subaccount: "ACCT_36lp0bsvdqusuon",
      currency: "NGN",
      metadata,
      ref,
      callback: (response) => handlePaystackSuccess(response),
      onClose: () => handlePaystackClose(),
      onerror: (error) => console.error("error in paystack: ", error),
    });

    handler.openIframe();
  } catch (error) {
    console.error("Paystack error: ", error);
  }
};

export const patchFormValues = (formFields, data) => {
  if (
    !formFields ||
    !data ||
    !(typeof formFields === "object") ||
    !(typeof data === "object") ||
    !Object.keys(formFields).length ||
    !Object.keys(data).length ||
    formFields[0] ||
    data[0]
  ) {
    return null;
  }

  let formValues = {};

  Object.keys(formFields).forEach((key) => {
    formValues[key] = {
      value: data[key] || "",
      valid: !!data[key] || formFields[key].valid,
    };
  });

  return formValues;
};

export const dynamicSort = (property) => {
  var sortOrder = 1;

  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }

  return function (a, b) {
    if (sortOrder == -1) {
      return b[property].localeCompare(a[property]);
    } else {
      return a[property].localeCompare(b[property]);
    }
  };
};

/**
 * Converts order details to a formatted WhatsApp message
 * @param {Object} orderData - The order object
 * @param {Array} products - Array of product details (optional, for product names)
 * @returns {string} - Formatted WhatsApp message
 */
export const formatOrderForWhatsApp = (orderData, amount) => {
  // Build the message
  let message = `🛒 *NEW ORDER REQUEST*\n\n`;

  // Customer Information
  message += `👤 *CUSTOMER DETAILS*\n`;
  message += `Name: ${orderData.customer.name}\n`;
  message += `Phone: ${orderData.customer.phoneNumber}\n`;
  message += `Email: ${orderData.customer.email}\n`;
  message += `Address: ${orderData.customer.address}\n\n`;

  // Recipient Information (if different from customer)
  if (
    orderData.recipient &&
    orderData.recipient.name !== orderData.customer.name
  ) {
    message += `📦 *RECIPIENT DETAILS*\n`;
    message += `Name: ${orderData.recipient.name}\n`;
    message += `Phone: ${orderData.recipient.phoneNumber}\n\n`;
  }

  // Order Items
  message += `🍽️ *ORDER ITEMS*\n`;
  orderData.orderItems.forEach((item, index) => {
    message += `${index + 1}. ${item.name} [${item.size}] x${item.quantity}`;

    // Add toppings if any
    if (item.toppings && item.toppings.length > 0) {
      message += `\n   Toppings: ${item.toppings.join(", ")}`;
    }
    message += `\n`;
  });
  message += `\n`;

  // Delivery Information
  message += `🚚 *DELIVERY DETAILS*\n`;
  message += `Location: ${orderData.deliveryLocation.address}\n`;
  message += `City: ${orderData.city}\n`;
  message += `State: ${orderData.state}\n`;

  if (orderData.deliveryDate) {
    message += `Delivery Date: ${new Date(
      orderData.deliveryDate,
    ).toLocaleDateString()}\n`;
  }

  if (orderData.specialNote) {
    message += `\n📝 *Special Note:*\n${orderData.specialNote}\n`;
  }

  if (amount) {
    message += `\n💰 *TOTAL AMOUNT*: NGN ${amount.toLocaleString()} (including delivery)\n`;
  }

  message += `\n✅ Please confirm this order. Thank you!`;

  return message;
};

/**
 * Opens WhatsApp with pre-filled order message
 * @param {Object} orderData - The order object
 * @param {string} businessPhone - Business WhatsApp number (with country code, no +)
 * @param {Array} products - Array of product details (optional)
 */
export const sendOrderToWhatsApp = (orderData, amount) => {
  const message = formatOrderForWhatsApp(orderData, amount);
  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = "2347018249203";

  // WhatsApp URL format
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  // Open in new window/tab
  window.open(whatsappUrl, "_blank");
};

/**
 * Alternative: Get WhatsApp URL without opening
 * @param {Object} orderData - The order object
 * @param {string} businessPhone - Business WhatsApp number (with country code, no +)
 * @param {Array} products - Array of product details (optional)
 * @returns {string} - WhatsApp URL
 */
export const getWhatsAppUrl = (orderData, businessPhone, products = []) => {
  const message = formatOrderForWhatsApp(orderData, products);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${businessPhone}?text=${encodedMessage}`;
};

// ============================================
// USAGE EXAMPLES
// ============================================

// Example 1: With product names
const products = [
  { id: "aba77671-058c-40b6-ac8b-62c4c8cacfdd", name: "Jollof Rice Special" },
  { id: "41bc1267-fd3b-4f25-a45b-9448abf8e40a", name: "Chicken Suya" },
  { id: "c73f0449-441a-4288-aa8e-d12eed79c645", name: "Fried Plantain" },
  { id: "7921dedc-6818-47fc-a93d-3e68f380c8df", name: "Moi Moi" },
  { id: "e67114d2-71ba-4fea-85c6-21c81068a6a6", name: "Chapman Drink" },
];

// Direct send to WhatsApp
// sendOrderToWhatsApp(orderData, "2348066916000", products);

// Example 2: Button click handler
const handleWhatsAppOrder = () => {
  const businessPhone = "2348066916000"; // Format: country code + number (no +)
  sendOrderToWhatsApp(orderData, businessPhone, products);
};

// Example 3: Use as link href
// const whatsappUrl = getWhatsAppUrl(orderData, "2348066916000", products);
// <a href={whatsappUrl} target="_blank">Send to WhatsApp</a>

// Example 4: React component usage
/*
function CartCheckoutButton({ orderData, products }) {
  const handleClick = () => {
    sendOrderToWhatsApp(orderData, "2348066916000", products);
  };

  return (
    <button 
      onClick={handleClick}
      className="bg-green-500 text-white px-6 py-3 rounded-lg"
    >
      📱 Send Order via WhatsApp
    </button>
  );
}
*/
