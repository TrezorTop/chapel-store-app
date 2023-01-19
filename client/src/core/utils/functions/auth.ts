import { api } from "../../config/api";
import { USER_ACCESS_TOKEN_KEY, USER_REFRESH_TOKEN_KEY } from "../consts/urls";

export const updateAuthTokens = (accessToken?: string, refreshToken?: string) => {
  if (!accessToken) return;

  api.defaults.headers["authorization"] = `Bearer ${accessToken}`;

  localStorage.setItem(USER_ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(USER_REFRESH_TOKEN_KEY, refreshToken ?? localStorage.getItem(USER_REFRESH_TOKEN_KEY)!);
};

export const removeAuthTokens = () => {
  delete api.defaults.headers["authorization"];
  localStorage.removeItem(USER_ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_REFRESH_TOKEN_KEY);
};
