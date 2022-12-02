import Cookies from "js-cookie";
import React, { FC, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { signInUrl, userToken } from "../../../utils/consts";

interface IRequireAuthProps {
  children: ReactNode;
}

export const RequireAuth: FC<IRequireAuthProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.get(userToken)) navigate(signInUrl);
  }, []);

  return <>{children}</>;
};
