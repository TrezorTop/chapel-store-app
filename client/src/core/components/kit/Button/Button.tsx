import { Button as MuiButton, ButtonProps } from "@mui/material";
import React, { FC } from "react";

export const Button: FC<ButtonProps> = ({ children, ...props }) => {
  return <MuiButton {...props}>{children}</MuiButton>;
};
