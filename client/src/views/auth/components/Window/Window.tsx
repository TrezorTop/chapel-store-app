import React, { FC, ReactNode } from "react";

import { Paper } from "../../../../core/components/kit/Paper/Paper";
import { Typography } from "../../../../core/components/kit/Typography/Typography";

import s from "./Window.module.scss";

type TWindow = {
  children?: ReactNode;
  header?: string;
};

export const Window: FC<TWindow> = ({ children, header }) => {
  return (
    <Paper className={s.root}>
      {header && (
        <Typography textAlign="center" marginBottom variant="h4">
          {header}
        </Typography>
      )}
      {children}
    </Paper>
  );
};
