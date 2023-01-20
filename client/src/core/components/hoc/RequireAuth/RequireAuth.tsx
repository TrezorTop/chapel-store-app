import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDebounce } from "usehooks-ts";

import {
  General_Unauthorized,
  Refresh_UsedTokenError,
  Refresh_WrongTokenError,
} from "../../../../../../shared/consts/error";
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

type RequireAuthProps = {
  children: ReactNode;
};

export const RequireAuth: FC<RequireAuthProps> = ({ children }) => {
  const [isNetworkError, setIsNetworkError] = useState<boolean>(false);
  const [authError, setAuthError] = useState<boolean>(false);
  const debouncedValue = useDebounce<boolean>(authError, 500);

  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location?.state as { requireAuth: boolean };
  const requireAuth = locationState?.requireAuth;

  useEffect(() => {
    // if (requireAuth === false) return;

    const broadcast = new BroadcastChannel(HTTP_BROADCAST_KEY);

    broadcast.onmessage = (event) => {
      if (event.data === NETWORK_ERROR) setIsNetworkError(true);

      if (event.data === General_Unauthorized) {
        setAuthError(true);
      }
      if (event.data === Refresh_UsedTokenError || event.data === Refresh_WrongTokenError)
        return navigate(`${AUTH_URL}/${SIGN_IN_URL}`, { state: { referrer: location.pathname } });
    };

    return () => {
      broadcast.close();
    };
  }, []);

  useEffect(() => {
    authError &&
      refreshToken({ refreshToken: localStorage.getItem(USER_REFRESH_TOKEN_KEY) ?? "" }).then((data) => {
        updateAuthTokens(data.data.accessToken, data.data.refreshToken);
        return data;
      });
  }, [debouncedValue]);

  useQuery([PingPath], ping);

  return (
    <>
      <AnimatePresence>
        {/* {refreshTokenIsLoading && <GlobalLoader />} */}
        {/* {isNetworkError && <GlobalLoader showLoader={false} />} */}
      </AnimatePresence>
      {api.defaults.headers["authorization"] && children}
    </>
  );
};
