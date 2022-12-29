import { LoginPath, LoginRequest, LoginResponse } from "../../../../shared/endpoints/auth/login";
import { RefreshPath, RefreshRequest, RefreshResponse } from "../../../../shared/endpoints/auth/refresh";
import { RegisterPath, RegisterRequest, RegisterResponse } from "../../../../shared/endpoints/auth/register";
import { PingPath } from "../../../../shared/endpoints/health/ping";
import { api } from "../config/api";

export const signIn = ({ password, username }: LoginRequest) =>
  api.post<LoginResponse>(LoginPath, {
    password,
    username,
  });

export const signUp = ({ password, username }: RegisterRequest) =>
  api.post<RegisterResponse>(RegisterPath, {
    username,
    password,
  });

export const refershToken = ({ refreshToken }: RefreshRequest) =>
  api.post<RefreshResponse>(RefreshPath, {
    refreshToken,
  });

export const ping = () => api.get(PingPath);
