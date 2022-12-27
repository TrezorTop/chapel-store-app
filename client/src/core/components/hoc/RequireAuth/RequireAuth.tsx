import { AnimatePresence } from "framer-motion";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { General_Unauthorized, Refresh_UsedTokenError } from "../../../../../../shared/consts/error";
import { usePing, useRefreshToken } from "../../../services/user.service";
import { HTTP_BROADCAST_KEY, NETWORK_ERROR, SIGN_IN_URL } from "../../../utils/consts";
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

    const broadcast = new BroadcastChannel(HTTP_BROADCAST_KEY);

    broadcast.onmessage = (event) => {
      if (event.data === NETWORK_ERROR) setIsNetworkError(true);
      if (event.data === General_Unauthorized) return mutateRefreshToken();
      if (event.data === Refresh_UsedTokenError) return navigate(SIGN_IN_URL);
    };

    mutatePing();

    return () => broadcast.close();
  }, []);

  const { mutate: mutatePing } = usePing();

  const { mutate: mutateRefreshToken, isLoading: refreshTokenIsLoading } = useRefreshToken();

  return (
    <>
      <AnimatePresence>
        {refreshTokenIsLoading && <GlobalLoader />}
        {/* {isNetworkError && <GlobalLoader showLoader={false} />} */}
      </AnimatePresence>
      {children}
    </>
  );
};
