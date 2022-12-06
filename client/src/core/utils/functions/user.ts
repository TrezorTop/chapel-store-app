import Cookies from "js-cookie";

import { api } from "../../config/api";
import { userAccessToken, userRefreshToken } from "../consts";

export const updateAuthToken = async (
  accessToken: string,
  refreshToken: string,
) => {
  api.defaults.headers["authorization"] = `Bearer ${accessToken}`;

  Cookies.set(userAccessToken, accessToken);
  localStorage.setItem(userRefreshToken, refreshToken);
};
