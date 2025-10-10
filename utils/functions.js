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
  console.log(error)
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
  metadata
) => {
  analyticsService.trackEvent("paystack_intiated", {
    email, ref, amount, metadata
  })
  // pk_live_42c6b07dfc9fd32654d4cc9fd39b08a031ac8826
  // pk_test_54ed04488bcc1a192bd2406fd36cfd8596e3ccae
  const handler = window.PaystackPop.setup({
    key:
      paystack_env !== "dev"
        ? "pk_live_42c6b07dfc9fd32654d4cc9fd39b08a031ac8826"
        : "pk_test_54ed04488bcc1a192bd2406fd36cfd8596e3ccae",
    email,
    amount,
    currency: "NGN",
    metadata,
    ref,
    callback: (response) => handlePaystackSuccess(response),
    onClose: () => handlePaystackClose(),
  });

  handler.openIframe();
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
