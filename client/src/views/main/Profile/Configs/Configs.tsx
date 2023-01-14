import { useQuery } from "@tanstack/react-query";

import { GetMyConfigsPath } from "../../../../../../shared/endpoints/me/getMyConfigs";
import { Typography } from "../../../../core/components/kit/Typography/Typography";
import { getProfileConfigs } from "../../../../core/services/profile.service";
import { ConfigItem } from "./ConfigItem/ConfigItem";
import s from "./Configs.module.scss";

export const Configs = () => {
  const { data } = useQuery([GetMyConfigsPath], getProfileConfigs);

  return (
    <div>
      <Typography variant="h4" marginBottom>
        Configurations
      </Typography>

      <div className={s.container}>
        {data?.data.configs.map((config) => (
          <ConfigItem key={config.id} config={config} />
        ))}
      </div>
    </div>
  );
};
