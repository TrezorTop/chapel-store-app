import axios from "axios";
import Cookies from "js-cookie";
import { BasePath } from "../../../../shared";

import { apiUrl, userToken } from "../utils/consts";

export const api = axios.create({
  baseURL: apiUrl,
  timeout: 15000,
  headers: { Authorization: `Bearer ${Cookies.get(userToken)}` },
});

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  },
);
