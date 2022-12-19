import React, { FC, ReactNode } from "react";

import s from './Error.module.scss'

type Error = {
  children?: ReactNode;
};

export const Error: FC<Error> = ({ children }) => {
  return <div className={s.root}>{children}</div>;
};
