import classNames from "classnames";
import React, { FC, HTMLAttributes, ReactNode } from "react";

import s from "./Main.module.scss";

type MainProps = {
  children?: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const Main: FC<MainProps> = ({ children, className }) => {
  return (
    <div className={classNames(s.root, className)}>
      <div>{children}</div>
    </div>
  );
};
