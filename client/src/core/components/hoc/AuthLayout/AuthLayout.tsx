import React, { FC, ReactNode } from "react";

import s from "./AuthLayout.module.scss";

interface IAuthLayoutProps {
  children?: ReactNode;
}

export const AuthLayout: FC<IAuthLayoutProps> = ({ children }) => {
  return <div className={s.root}>{children}</div>;
};
