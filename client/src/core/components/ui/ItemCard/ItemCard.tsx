import { FC } from "react";
import { Button } from "../../kit/Button/Button";
import { Paper } from "../../kit/Paper/Paper";

import s from './ItemCard.module.scss'

type ItemCardProps = {
  title?: string;
};

export const ItemCard: FC<ItemCardProps> = ({ title }) => {
  return <Paper className={s.root}>{title} <Button variant='outlined' size='small'>Download</Button></Paper>;
};
