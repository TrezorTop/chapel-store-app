import { Paper as MuiPaper, PaperProps } from "@mui/material";
import classNames from "classnames";
import React, { FC } from "react";

import s from "./Paper.module.scss";

export const Paper: FC<PaperProps> = ({ children, className, ...props }) => {
  return (
    <MuiPaper
      variant="outlined"
      className={classNames(s.root, className)}
      {...props}
    >
      {children}
    </MuiPaper>
  );
};
