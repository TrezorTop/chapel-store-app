import { useMutation, useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { JsonValue } from "../../../../../../../server/src/infrastructure/prismaConnect";

import { GetByIdConfigsPath } from "../../../../../../../shared/endpoints/configs/getById";
import { GetMyConfigsResponse } from "../../../../../../../shared/endpoints/me/getMyConfigs";
import { Button } from "../../../../../core/components/kit/Button/Button";
import { Paper } from "../../../../../core/components/kit/Paper/Paper";
import { getConfig } from "../../../../../core/services/main.service";
import { generateFile } from "../../../../../core/utils/functions/generateFile";
import s from "./ConfigItem.module.scss";

type ItemCardProps = {
  config?: GetMyConfigsResponse["configs"][0];
};

export const ConfigItem: FC<ItemCardProps> = ({ config }) => {
  const { mutate } = useMutation([GetByIdConfigsPath], () => getConfig({ id: config?.id ?? "" }), {
    onSuccess: ({ data }) => {
      generateFile(data.config?.title, data.config?.data?.toString());
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
