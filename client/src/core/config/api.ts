import axios, { AxiosError } from "axios";

import { ErrorResponse } from "../../../../shared/consts/error";
import { API_URL, AUTH_ERRORS, HTTP_BROADCAST_KEY, NETWORK_ERROR } from "../utils/consts/urls";

export const api = axios.create({
  baseURL: API_URL,
  // headers: {
  //   ...(localStorage.getItem(USER_ACCESS_TOKEN_KEY) && {
  //     authorization: `Bearer ${localStorage.getItem(USER_ACCESS_TOKEN_KEY)}`,
  //   }),
  // },
});

export const httpBroadcast = new BroadcastChannel(HTTP_BROADCAST_KEY);

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
    if (AUTH_ERRORS.includes(error.response?.data.message)) httpBroadcast.postMessage(error.response?.data.message);

    if (error.code === NETWORK_ERROR) httpBroadcast.postMessage(NETWORK_ERROR);

    return Promise.reject(error);
  },
);
