import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

import { ErrorResponse } from "../../../../shared/consts/error";
import { apiUrl, userAccessTokenKey } from "../utils/consts";

export const api = axios.create({
  baseURL: apiUrl,
  timeout: 15000,
  headers: {
    authorization: `Bearer ${Cookies.get(userAccessTokenKey)}`,
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
  (error: AxiosError<ErrorResponse>) => {
    if (error.response?.status === 403 || error.response?.status === 401) {
      broadcast.postMessage(error.response.status);
    }

    return Promise.reject(error);
  },
);
