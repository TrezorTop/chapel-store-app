import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  General_Unauthorized,
  Refresh_UsedTokenError,
  Refresh_WrongTokenError,
} from "../../../../../../shared/consts/error";
import { RefreshPath } from "../../../../../../shared/endpoints/auth/refresh";
import { PingPath } from "../../../../../../shared/endpoints/health/ping";
import { api } from "../../../config/api";
import { ping, refreshToken } from "../../../services/user.service";
import {
  AUTH_URL,
  HTTP_BROADCAST_KEY,
  NETWORK_ERROR,
  SIGN_IN_URL,
  USER_ACCESS_TOKEN_KEY,
  USER_REFRESH_TOKEN_KEY,
} from "../../../utils/consts/urls";
import { updateAuthTokens } from "../../../utils/functions/auth";
import { GlobalLoader } from "../../kit/GlobalLoader/GlobalLoader";

type RequireAuthProps = {
  children: ReactNode;
};

export const RequireAuth: FC<RequireAuthProps> = ({ children }) => {
  const [isNetworkError, setIsNetworkError] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location?.state as { requireAuth: boolean };
  const requireAuth = locationState?.requireAuth;

  useEffect(() => {
    // if (requireAuth === false) return;

    api.defaults.headers["authorization"] = `Bearer ${localStorage.getItem(USER_ACCESS_TOKEN_KEY)}`;

    const broadcast = new BroadcastChannel(HTTP_BROADCAST_KEY);

    broadcast.onmessage = (event) => {
      if (event.data === NETWORK_ERROR) setIsNetworkError(true);
      if (event.data === General_Unauthorized) return mutateRefreshToken();
      if (event.data === Refresh_UsedTokenError || event.data === Refresh_WrongTokenError)
        return navigate(`${AUTH_URL}/${SIGN_IN_URL}`, { state: { referrer: location.pathname } });
    };

    return () => {
      delete api.defaults.headers["authorization"];
      broadcast.close();
    };
  }, []);

  useQuery([PingPath], ping);

  const { mutate: mutateRefreshToken, isLoading: refreshTokenIsLoading } = useMutation(
    [RefreshPath],
    () => refreshToken({ refreshToken: localStorage.getItem(USER_REFRESH_TOKEN_KEY) ?? "" }),
    {
      onSuccess: ({ data }) => {
        updateAuthTokens(data.accessToken, data.refreshToken);
        api.defaults.headers["authorization"] = `Bearer ${data.accessToken}`;
      },
    },
  );

  return (
    <>
      <AnimatePresence>
        {refreshTokenIsLoading && <GlobalLoader />}
        {/* {isNetworkError && <GlobalLoader showLoader={false} />} */}
      </AnimatePresence>
      {api.defaults.headers["authorization"] && children}
    </>
  );
};
