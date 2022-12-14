import { Typography } from "../../../../core/components/kit/Typography/Typography";
import { ItemCard } from "../../../../core/components/ui/ItemCard/ItemCard";

import s from "./Configs.module.scss";

export const Configs = () => {
  return (
    <div>
      <Typography variant="h4" marginBottom>
        Configurations
      </Typography>

      <div className={s.container}>
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
      </div>
    </div>
  );
};
