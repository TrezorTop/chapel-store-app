import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { General_Unauthorized } from "../../../../../../shared/consts/error";
import { PingPath } from "../../../../../../shared/endpoints/health/ping";
import { ping } from "../../../services/user.service";
import { AUTH_URL, HTTP_BROADCAST_KEY, REFRESH_ERRORS, SIGN_IN_URL } from "../../../utils/consts/consts";

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

    const broadcast = new BroadcastChannel(HTTP_BROADCAST_KEY);

    broadcast.onmessage = (event) => {
      console.log(event.data);

      if (event.data === General_Unauthorized) {
        // setAuthError(true);
      }

      if (REFRESH_ERRORS.includes(event.data))
        return navigate(`${AUTH_URL}/${SIGN_IN_URL}`, { state: { referrer: location.pathname } });
    };

    return () => {
      broadcast.close();
    };
  }, []);

  useQuery([PingPath], ping);

  return (
    <>
      <AnimatePresence>
        {/* <GlobalLoader /> */}
        {/* {isNetworkError && <GlobalLoader showLoader={false} />} */}
      </AnimatePresence>
      {children}
    </>
  );
};
