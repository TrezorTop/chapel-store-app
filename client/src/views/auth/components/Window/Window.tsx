import React, { FC, ReactNode } from "react";

import { Paper } from "../../../../core/components/kit/Paper/Paper";

import s from "./Window.module.scss";

type TWindow = {
  children?: ReactNode;
};

export const Window: FC<TWindow> = ({ children }) => {
  return <Paper className={s.root}>{children}</Paper>;
};
