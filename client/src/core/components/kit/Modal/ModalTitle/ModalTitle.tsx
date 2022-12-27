import React, { FC, ReactNode } from "react";
import { Paper } from "../../Paper/Paper";

type TModalTitle = {
  children?: ReactNode;
};

export const ModalTitle: FC<TModalTitle> = ({ children }) => {
  return <div>{children}</div>;
};
