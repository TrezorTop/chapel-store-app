import { type } from "os";
import React, { FC, ReactNode } from "react";

import s from './Header.module.scss'

type HeaderProps = {
  children: ReactNode;
};

export const Header: FC<HeaderProps> = ({ children }) => {
  return <div className={s.root}>{children}</div>;
};
