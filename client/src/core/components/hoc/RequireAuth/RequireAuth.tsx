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
    // TEMPORARY
    // localStorage.setItem(
    //   userRefreshToken,
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lciI6IjEiLCJpYXQiOjE2NzAyNjkxMDIsImV4cCI6MTY3Mjg2MTEwMn0._bNsChaxy9T6PRL8hrNX9Ih42mMUHKm4Znu83dd7t2o",
    // );

    const broadcast = new BroadcastChannel("httpInterceptor");

    broadcast.onmessage = (event) => {
      if (event.data === 401) return mutateRefresh();
      if (event.data === 403) return navigate(signInUrl);
    };

    return () => broadcast.close();
  }, []);

  const { mutate: mutatePing, isLoading: pingIsLoading } = useMutation(
    ["ping"],
    () => ping(),
    {
      onSuccess: () => {
        return;
      },
      onError: () => {
        if (!localStorage.getItem(userRefreshToken)) mutateRefresh();
        else navigate(signInUrl);
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
