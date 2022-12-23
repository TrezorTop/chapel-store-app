import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

import { ErrorResponse } from "../../../../shared/consts/error";
import { LoginPath, LoginRequest, LoginResponse } from "../../../../shared/endpoints/auth/login";
import { RefreshPath, RefreshResponse } from "../../../../shared/endpoints/auth/refresh";
import { RegisterPath, RegisterRequest, RegisterResponse } from "../../../../shared/endpoints/auth/register";
import { PingPath } from "../../../../shared/endpoints/health/ping";
import { queryClient } from "../../main";
import { api } from "../config/api";
import { EMPTY_URL, MAIN_URL, SIGN_IN_URL, USER_REFRESH_TOKEN_KEY } from "../utils/consts";
import { updateAuthTokens } from "../utils/functions/auth";

export const useSignIn = () => {
  const navigate = useNavigate();

  return useMutation<AxiosResponse<LoginResponse>, AxiosError<ErrorResponse>, LoginRequest>(
    [LoginPath],
    ({ password, username }) =>
      api.post(LoginPath, {
        password,
        username,
      }),
    {
      onSuccess: ({ data }) => {
        updateAuthTokens(data.accessToken, data.refreshToken);
        navigate(MAIN_URL, { state: { requireAuth: false } });
      },
    },
  );
};

export const useSignUp = () => {
  const navigate = useNavigate();

  return useMutation<AxiosResponse<RegisterResponse>, AxiosError<ErrorResponse>, RegisterRequest>(
    [RegisterPath],
    ({ username, password }) =>
      api.post(RegisterPath, {
        username,
        password,
      }),
    {
      onSuccess: ({ data }) => {
        updateAuthTokens(data.accessToken, data.refreshToken);
        navigate(EMPTY_URL, { state: { requireAuth: false } });
      },
    },
  );
};

export const useRefreshToken = () => {
  const navigate = useNavigate();
  const refreshToken = localStorage.getItem(USER_REFRESH_TOKEN_KEY);

  return useMutation<AxiosResponse<RefreshResponse>, AxiosError<ErrorResponse>>(
    [RefreshPath],
    () =>
      api.post(RefreshPath, {
        refreshToken,
      }),
    {
      onSuccess: ({ data }) => {
        updateAuthTokens(data.accessToken, data.refreshToken);
        queryClient.cancelQueries({ queryKey: [RefreshPath] });
      },
      onError: () => {
        navigate(SIGN_IN_URL);
      },
    },
  );
};

export const usePing = () => {
  return useMutation([PingPath], () =>
    api.get(PingPath, {
      headers: {
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
    }),
  );
};
