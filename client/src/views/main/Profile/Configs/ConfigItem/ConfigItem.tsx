import { useMutation } from "@tanstack/react-query";
import { FC } from "react";

import { GetByIdConfigsPath } from "../../../../../../../shared/endpoints/configs/getById";
import { GetMyConfigsResponse } from "../../../../../../../shared/endpoints/me/getMyConfigs";
import { Button } from "../../../../../core/components/kit/Button/Button";
import { Paper } from "../../../../../core/components/kit/Paper/Paper";
import { getProfileConfigById } from "../../../../../core/services/profile.service";
import { generateFile } from "../../../../../core/utils/functions/file";
import s from "./ConfigItem.module.scss";

type ItemCardProps = {
  config?: GetMyConfigsResponse["configs"][0];
};

export const ConfigItem: FC<ItemCardProps> = ({ config }) => {
  const { mutate } = useMutation([GetByIdConfigsPath], () => getProfileConfigById({ id: config?.id ?? "" }), {
    onSuccess: ({ data }) => {
      // generateFile(data.config?.title, JSON.stringify(data.config.data));
    },
  });

  return (
    <Paper className={s.root}>
      {config?.title}
      <Button variant="outlined" size="small" onClick={() => mutate()}>
        Download
      </Button>
    </Paper>
  );
};
