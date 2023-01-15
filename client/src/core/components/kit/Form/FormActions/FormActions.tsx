import React, { FC, ReactNode } from "react";

import s from "./FormActions.module.scss";

type TFormActionsProps = {
  children?: ReactNode;
  variant?: "vertical" | "horizontal";
};

export const FormActions: FC<TFormActionsProps> = ({ children, variant = "vertical" }) => {
  return <div className={s[variant]}>{children}</div>;
};
