import { Button as MuiButton, ButtonProps } from "@mui/material";
import React, { FC } from "react";

export const Button: FC<ButtonProps> = ({ children, variant, ...props }) => {
  return (
    <MuiButton variant={variant ?? 'contained'} {...props}>
      {children}
    </MuiButton>
  );
};
