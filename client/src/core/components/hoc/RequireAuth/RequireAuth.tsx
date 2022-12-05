import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import React, { FC, ReactNode, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { ping, refreshToken } from "../../../services/Auth.service";
import {
  signInUrl,
  userAccessToken,
  userRefreshToken,
} from "../../../utils/consts";
import { updateAuthToken as updateAuthTokens } from "../../../utils/functions/user";
import { GlobalLoader } from "../../ui/GlobalLoader/GlobalLoader";

type RequireAuthProps = {
  children: ReactNode;
};

export const RequireAuth: FC<RequireAuthProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const broadcast = new BroadcastChannel("httpInterceptor");

    broadcast.onmessage = (event) => {
      if (event.data === 401) return mutateRefresh();
      if (event.data === 403) return navigate(signInUrl);
    };

    mutatePing();

    return () => broadcast.close();
  }, []);

  const { mutate: mutatePing, isLoading: pingIsLoading } = useMutation(
    ["ping"],
    () => ping(),
    {
      onSuccess: () => {
        return;
      },
    },
  );

  const { mutate: mutateRefresh, isLoading: refreshIsLoading } = useMutation(
    ["refreshToken"],
    () =>
      refreshToken({
        refreshToken: localStorage.getItem(userRefreshToken) ?? "",
      }),
    {
      onSuccess: ({ data }) => {
        return updateAuthTokens(data.accessToken, data.refreshToken);
      },
      onError: () => {
        navigate(signInUrl);
      },
    },
  );

  if (pingIsLoading || refreshIsLoading) return <GlobalLoader />;

  return <>{children}</>;
};
