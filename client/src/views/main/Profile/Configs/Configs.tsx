import { useEffect } from "react";
import { Typography } from "../../../../core/components/kit/Typography/Typography";
import { ItemCard } from "../../../../core/components/ui/ItemCard/ItemCard";
import { useUserConfigs } from "../../../../core/services/payment.service";

import s from "./Configs.module.scss";

export const Configs = () => {
  const { data: userConfigsData } = useUserConfigs();

  return (
    <div>
      <Typography variant="h4" marginBottom>
        Configurations
      </Typography>

      <div className={s.container}>
        {userConfigsData?.data.configs.map((config) => (
          <ItemCard key={config.id} title={config.title} />
        ))}
      </div>
    </div>
  );
};
