import {
  LoginPath,
  LoginRequest,
  LoginResponse,
} from "../../../../shared/login";
import {
  RefreshPath,
  RefreshRequest,
  RefreshResponse,
} from "../../../../shared/refresh";
import {
  RegisterPath,
  RegisterRequest,
  RegisterResponse,
} from "../../../../shared/register";
import { api } from "../config/api";

export const signIn = ({ password, username }: LoginRequest) =>
  api.post<LoginResponse>(LoginPath, {
    password,
    username,
  });

export const signUp = ({ username, password }: RegisterRequest) =>
  api.post<RegisterResponse>(RegisterPath, {
    username,
    password,
  });

export const refreshToken = ({ refreshToken }: RefreshRequest) =>
  api.post<RefreshResponse>(RefreshPath, {
    refreshToken,
  });

export const ping = () => api.get<RefreshResponse>('/api/auth/ping');
