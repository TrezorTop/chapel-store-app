import { RegisterRequest, RegisterResponse } from "../../../../shared/auth";
import { api } from "../utils/api";

export const AuthService = {
  // signIn: () => api.post(),

  signUp: () => api.post<RegisterRequest, RegisterResponse>("/"),
};
