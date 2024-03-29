import {
  ConfirmResetPasswordPath,
  ConfirmResetPasswordRequest,
  ConfirmResetPasswordResponse,
} from "../../../../shared/endpoints/auth/confirmResetPassword";
import { LoginPath, LoginRequest, LoginResponse } from "../../../../shared/endpoints/auth/login";
import { RefreshPath, RefreshResponse } from "../../../../shared/endpoints/auth/refresh";
import { RegisterPath, RegisterRequest, RegisterResponse } from "../../../../shared/endpoints/auth/register";
import {
  RequestResetPasswordPath,
  RequestResetPasswordRequest,
  RequestResetPasswordResponse,
} from "../../../../shared/endpoints/auth/requestResetPassword";
import {
  VerifyEmailPath,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "../../../../shared/endpoints/auth/verifyEmail";
import { PingPath } from "../../../../shared/endpoints/health/ping";
import { api } from "../config/api";
import { USER_REFRESH_TOKEN_KEY } from "../utils/consts/consts";

export const signIn = (data: LoginRequest) => api.post<LoginResponse>(LoginPath, data);

export const signUp = (data: RegisterRequest) => api.post<RegisterResponse>(RegisterPath, data);
export const verifyEmail = (data: VerifyEmailRequest) => api.post<VerifyEmailResponse>(VerifyEmailPath, data);

export const ping = () => api.get(PingPath);

export const refreshToken = () =>
  api.post<RefreshResponse>(RefreshPath, {
    refreshToken: localStorage.getItem(USER_REFRESH_TOKEN_KEY),
  });

export const requestResetPassword = (data: RequestResetPasswordRequest) =>
  api.post<RequestResetPasswordResponse>(RequestResetPasswordPath, data);

export const confirmResetPassword = (data: ConfirmResetPasswordRequest) =>
  api.post<ConfirmResetPasswordResponse>(ConfirmResetPasswordPath, data);
