import Cookies from "js-cookie";

import { api } from "../../config/api";
import { userAccessTokenKey, userRefreshTokenKey } from "../consts";

export const updateAuthTokens = (accessToken: string, refreshToken: string) => {
  api.defaults.headers["authorization"] = `Bearer ${accessToken}`;

  Cookies.set(userAccessTokenKey, accessToken);
  localStorage.setItem(userRefreshTokenKey, refreshToken);
};

export const destroyAuthToken = () => {
  Cookies.remove(userAccessTokenKey);
  localStorage.removeItem(userRefreshTokenKey);
};

export const removeAuthTokens = () => {
  api.defaults.headers["authorization"] = `undefined`;
  Cookies.remove(userAccessToken);
  localStorage.removeItem(userRefreshToken);
};
