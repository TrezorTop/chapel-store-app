import { FC } from "react";
import { Paper } from "../../kit/Paper/Paper";

type ItemCardProps = {
  title?: string;
};

export const ItemCard: FC<ItemCardProps> = ({ title }) => {
  return <Paper>{title}</Paper>;
};
