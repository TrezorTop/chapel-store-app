import Cookies from "js-cookie";
import { api } from "../../config/api";
import { userToken } from "../consts";

export const onUserLogin = (token: string) => {
  Cookies.set(userToken, token);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
