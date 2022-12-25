import React, { FC, ReactNode } from "react";
import { Paper } from "../../Paper/Paper";

type TModalActions = {
  children?: ReactNode;
};

export const ModalActions: FC<TModalActions> = ({ children }) => {
  return <>{children}</>;
};
