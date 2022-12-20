import Cookies from "js-cookie";

import { api } from "../../config/api";
import { USER_ACCESS_TOKEN_KEY, USER_REFRESH_TOKEN_KEY } from "../consts";

export const updateAuthTokens = (accessToken: string, refreshToken: string) => {
  api.defaults.headers["authorization"] = `Bearer ${accessToken}`;

  Cookies.set(USER_ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(USER_REFRESH_TOKEN_KEY, refreshToken);
};

export const destroyAuthToken = () => {
  Cookies.remove(USER_ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_REFRESH_TOKEN_KEY);
};

export const removeAuthTokens = () => {
  api.defaults.headers["authorization"] = `undefined`;
  Cookies.remove(USER_ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_REFRESH_TOKEN_KEY);
};
