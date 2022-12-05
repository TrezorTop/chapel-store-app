import {
  RegisterPath,
  RegisterRequest,
  RegisterResponse,
} from "../../../../shared/register";
import { api } from "../config/api";

export const AuthService = {
  // signIn: ({}: ) => api.post(),

  signUp: ({ username, password }: RegisterRequest) =>
    api.post<RegisterResponse>(RegisterPath, { username, password }),
};
