import { LoginPath, LoginRequest, LoginResponse } from "../../../../shared/endpoints/auth/login";
import { RefreshPath, RefreshRequest, RefreshResponse } from "../../../../shared/endpoints/auth/refresh";
import { RegisterPath, RegisterRequest, RegisterResponse } from "../../../../shared/endpoints/auth/register";
import { PingPath } from "../../../../shared/endpoints/health/ping";
import { api } from "../config/api";

export const signIn = (data: LoginRequest) => api.post<LoginResponse>(LoginPath, data);

export const signUp = (data: RegisterRequest) => api.post<RegisterResponse>(RegisterPath, data);

export const ping = () => api.get(PingPath);

export const refreshToken = (data: RefreshRequest) => api.post<RefreshResponse>(RefreshPath, data);
