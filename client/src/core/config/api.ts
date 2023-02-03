import axios, { AxiosError } from "axios";

import { ErrorResponse, Refresh_UsedTokenError } from "../../../../shared/consts/error";
import { refreshToken } from "../services/user.service";
import {
  API_URL,
  AUTH_ERRORS,
  HTTP_BROADCAST_KEY,
  REFRESH_ERRORS,
  USER_ACCESS_TOKEN_KEY,
  USER_REFRESH_TOKEN_KEY,
} from "../utils/consts/urls";
import { removeAuthTokens, updateAuthTokens } from "../utils/functions/auth";
import { debounce } from "../utils/functions/debounce";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    ...(localStorage.getItem(USER_ACCESS_TOKEN_KEY) && {
      authorization: `Bearer ${localStorage.getItem(USER_ACCESS_TOKEN_KEY)}`,
    }),
  },
});

export const broadcast = new BroadcastChannel(HTTP_BROADCAST_KEY);

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const debouncedRefresh = debounce(() => {
  refreshToken().then((data) => {
    updateAuthTokens(data.data.accessToken, data.data.refreshToken);
    return data;
  });
}, 300);

setInterval(() => {
  debouncedRefresh();
}, 120000);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ErrorResponse>) => {
    if (localStorage.getItem(USER_REFRESH_TOKEN_KEY) && AUTH_ERRORS.includes(error.response?.data.message))
      debouncedRefresh();
    else if (error.response?.data.message === Refresh_UsedTokenError) removeAuthTokens();
    else if (REFRESH_ERRORS.includes(error.response?.data.message) || !localStorage.getItem(USER_REFRESH_TOKEN_KEY))
      broadcast.postMessage(REFRESH_ERRORS[0]);

    return Promise.reject(error);
  },
);
