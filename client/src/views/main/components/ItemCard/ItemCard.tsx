import React, { FC, ReactNode } from "react";
import { Paper } from "../../../../core/components/kit/Paper/Paper";

import s from "./ItemCard.module.scss";

type TItemCard = {
  actions?: ReactNode;
  children?: ReactNode;
};

export const ItemCard: FC<TItemCard> = ({ children, actions }) => {
  return (
    <Paper className={s.root}>
      <div>{children}</div>
      <div className={s.actions}>{actions}</div>
    </Paper>
  );
};
