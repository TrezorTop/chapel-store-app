import { api } from "../../config/api";
import { USER_ACCESS_TOKEN_KEY, USER_REFRESH_TOKEN_KEY } from "../consts";

export const updateAuthTokens = (accessToken: string, refreshToken: string) => {
  api.defaults.headers["authorization"] = `Bearer ${accessToken}`;

  localStorage.setItem(USER_ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(USER_REFRESH_TOKEN_KEY, refreshToken);
};

export const destroyAuthToken = () => {
  localStorage.removeItem(USER_ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_REFRESH_TOKEN_KEY);
};

export const removeAuthTokens = () => {
  api.defaults.headers["authorization"] = `undefined`;
  localStorage.removeItem(USER_ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_REFRESH_TOKEN_KEY);
};
