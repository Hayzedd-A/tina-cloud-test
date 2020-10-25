import axios from "axios";

export const API = axios.create({
  baseURL: "https://zupa-api.dev.intelia.io/",
  headers: {}
});

export const getUserDetails = () => {
  return JSON.parse(localStorage.getItem("gourmet-twist-user"));
};

export const getRequest = async ({ url, params, token }) => {
  const currentUser = getUserDetails();

  var request = {
    url,
    method: "get",
    params
  };

  if (token && currentUser && currentUser.token) {
    request["headers"] = { authorization: `Bearer ${currentUser.token}` };
  }

  const requestResponse = await API(request);

  return requestResponse;
};

export const postRequest = async ({ url, params, data, token }) => {
  const currentUser = getUserDetails();

  var request = {
    url,
    method: "post",
    params,
    data
  };

  if (token && currentUser && currentUser.token) {
    request["headers"] = { authorization: `Bearer ${currentUser.token}` };
  }

  const requestResponse = await API(request);

  return requestResponse;
};

export const patchRequest = async ({ url, params, data, token }) => {
  const currentUser = getUserDetails();

  var request = {
    url,
    method: "put",
    params,
    data
  };

  if (token && currentUser && currentUser.token) {
    request["headers"] = { authorization: `Bearer ${currentUser.token}` };
  }

  const requestResponse = await API(request);

  return requestResponse;
};

export const deleteRequest = async ({ url, params, data, token }) => {
  const currentUser = getUserDetails();

  var request = {
    url,
    method: "delete",
    params,
    data
  };

  if (token && currentUser && currentUser.token) {
    request["headers"] = { authorization: `Bearer ${currentUser.token}` };
  }

  const requestResponse = await API(request);

  return requestResponse;
};
