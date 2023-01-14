import { api } from "../../config/api";
import { USER_ACCESS_TOKEN_KEY, USER_REFRESH_TOKEN_KEY } from "../consts/urls";

export const updateAuthTokens = (accessToken?: string, refreshToken?: string) => {
  if (!accessToken || !refreshToken) return;

  api.defaults.headers["authorization"] = accessToken;

  localStorage.setItem(USER_ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(USER_REFRESH_TOKEN_KEY, refreshToken);
};

export const removeAuthTokens = () => {
  localStorage.removeItem(USER_ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_REFRESH_TOKEN_KEY);
};
