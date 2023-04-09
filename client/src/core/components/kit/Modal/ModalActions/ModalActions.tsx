import React, { FC, ReactNode } from "react";

import s from "./ModalActions.module.scss";

type TModalActions = {
  children?: ReactNode;
};

export const ModalActions: FC<TModalActions> = ({ children }) => {
  return <div className={s.root}>{children}</div>;
};
