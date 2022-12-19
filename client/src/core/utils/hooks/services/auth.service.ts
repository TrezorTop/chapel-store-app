import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

import { ErrorResponse } from "../../../../../../shared/consts/error";
import { LoginPath, LoginRequest, LoginResponse } from "../../../../../../shared/endpoints/login";
import { RefreshPath, RefreshResponse } from "../../../../../../shared/endpoints/refresh";
import { RegisterPath, RegisterRequest, RegisterResponse } from "../../../../../../shared/endpoints/register";
import { api } from "../../../config/api";
import { emptyUrl, mainUrl, signInUrl, userRefreshTokenKey } from "../../consts";
import { updateAuthToken } from "../../functions/user";

export const useSignIn = () => {
  const navigate = useNavigate();

  return useMutation<
    AxiosResponse<LoginResponse>,
    AxiosError<ErrorResponse>,
    LoginRequest
  >(
    ["signIn"],
    ({ password, username }) =>
      api.post(LoginPath, {
        password,
        username,
      }),
    {
      onSuccess: ({ data }) => {
        updateAuthToken(data.accessToken, data.refreshToken);
        navigate(mainUrl, { state: { requireAuth: false } });
      },
    },
  );
};

export const useSignUp = () => {
  const navigate = useNavigate();

  return useMutation<
    AxiosResponse<RegisterResponse>,
    AxiosError<ErrorResponse>,
    RegisterRequest
  >(
    ["signIn"],
    ({ username, password }) =>
      api.post(RegisterPath, {
        username,
        password,
      }),
    {
      onSuccess: ({ data }) => {
        updateAuthToken(data.accessToken, data.refreshToken);
        navigate(emptyUrl, { state: { requireAuth: false } });
      },
    },
  );
};

export const useRefreshToken = () => {
  const navigate = useNavigate();
  const refreshToken = localStorage.getItem(userRefreshTokenKey);

  return useMutation<AxiosResponse<RefreshResponse>, AxiosError<ErrorResponse>>(
    ["refreshToken"],
    () =>
      api.post(RefreshPath, {
        refreshToken,
      }),
    {
      onSuccess: ({ data }) => {
        updateAuthToken(data.accessToken, data.refreshToken);
      },
      onError: () => {
        navigate(signInUrl);
      },
    },
  );
};

export const usePing = () => {
  return useMutation(["ping"], () => api.get("/api/auth/ping"));
};
