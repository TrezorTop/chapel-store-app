import { AnimatePresence } from "framer-motion";
import React, { FC, ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { usePing, useRefreshToken } from "../../../utils/hooks/services/auth.service";
import { signInUrl } from "../../../utils/consts";
import { GlobalLoader } from "../../ui/GlobalLoader/GlobalLoader";

type RequireAuthProps = {
  children: ReactNode;
};

export const RequireAuth: FC<RequireAuthProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location?.state as { requireAuth: boolean };
  const requireAuth = locationState?.requireAuth;

  useEffect(() => {
    if (requireAuth === false) return;

    const broadcast = new BroadcastChannel("httpInterceptor");

    broadcast.onmessage = (event) => {
      if (event.data === 401) return mutateRefresh();
      if (event.data === 403) return navigate(signInUrl);
    };

    mutatePing();

    return () => broadcast.close();
  }, []);

  const { mutate: mutatePing } = usePing();

  const { mutate: mutateRefresh, isLoading: refreshIsLoading } =
    useRefreshToken();

  return (
    <>
      <AnimatePresence>{refreshIsLoading && <GlobalLoader />}</AnimatePresence>
      {children}
    </>
  );
};
