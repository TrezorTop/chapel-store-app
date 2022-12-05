import React, { FC, ReactNode } from "react";
import { Paper } from "../../../ui/Paper/Paper";

import s from "./Main.module.scss";

type MainProps = {
  children?: ReactNode;
};

export const Main: FC<MainProps> = ({ children }) => {
  return (
    <div className={s.root}>
      <div>{children}</div>
    </div>
  );
};
