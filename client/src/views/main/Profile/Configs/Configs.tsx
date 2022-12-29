import { useQuery } from "@tanstack/react-query";
import { GetMyConfigsPath } from "../../../../../../shared/endpoints/me/getMyConfigs";
import { Typography } from "../../../../core/components/kit/Typography/Typography";
import { ItemCard } from "../../../../core/components/ui/ItemCard/ItemCard";
import { getMyConfigs } from "../../../../core/services/profile.service";
import s from "./Configs.module.scss";

export const Configs = () => {
  const { data } = useQuery([GetMyConfigsPath], getMyConfigs);

  return (
    <div>
      <Typography variant="h4" marginBottom>
        Configurations
      </Typography>

      <div className={s.container}>
        {data?.data.configs.map((config) => (
          <ItemCard key={config.id} title={config.title} />
        ))}
      </div>
    </div>
  );
};
