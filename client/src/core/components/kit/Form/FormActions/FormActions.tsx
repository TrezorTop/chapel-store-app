import React, { FC, ReactNode } from "react";

import s from './FormActions.module.scss'

type TFormActionsProps = {
  children: ReactNode;
};

export const FormActions: FC<TFormActionsProps> = ({ children }) => {
  return <div className={s.root}>{children}</div>;
};
