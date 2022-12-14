import Cookies from "js-cookie";

import { api } from "../../config/api";
import { userAccessToken, userRefreshToken } from "../consts";

export const updateAuthTokens = (accessToken: string, refreshToken: string) => {
  api.defaults.headers["authorization"] = `Bearer ${accessToken}`;

  Cookies.set(userAccessToken, accessToken);
  localStorage.setItem(userRefreshToken, refreshToken);
};

export const removeAuthTokens = () => {
  api.defaults.headers["authorization"] = `undefined`;
  Cookies.remove(userAccessToken);
  localStorage.removeItem(userRefreshToken);
};
