import axios from "axios";
import Cookies from "js-cookie";

import { apiUrl, userAccessToken } from "../utils/consts";

export const api = axios.create({
  baseURL: apiUrl,
  timeout: 15000,
  headers: {
    authorization: `Bearer ${Cookies.get(userAccessToken)}`,
  },
});
const broadcast = new BroadcastChannel("httpInterceptor");

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 403 || error.response?.status === 401) {
      broadcast.postMessage(error.response.status);
    }
    return Promise.reject(error);
  },
);
