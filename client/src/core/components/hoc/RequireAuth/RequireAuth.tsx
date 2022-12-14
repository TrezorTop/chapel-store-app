import { useMutation } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import React, { FC, ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ping, refreshToken } from "../../../services/Auth.service";
import { signInUrl, userRefreshToken } from "../../../utils/consts";
import { updateAuthTokens as updateAuthTokens } from "../../../utils/functions/auth";
import { GlobalLoader } from "../../kit/GlobalLoader/GlobalLoader";

type RequireAuthProps = {
  children: ReactNode;
};

export const RequireAuth: FC<RequireAuthProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location?.state as { requireAuth: boolean };
  const requireAuth = locationState?.requireAuth;

  useEffect(() => {
    // if (requireAuth === false) return;

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

  return (
    <>
      <AnimatePresence>{refreshIsLoading && <GlobalLoader />}</AnimatePresence>
      {children}
    </>
  );
};
