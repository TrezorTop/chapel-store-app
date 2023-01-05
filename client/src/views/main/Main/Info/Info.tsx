import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { GetByIdConfigsPath } from "../../../../../../shared/endpoints/configs/getById";

import { Typography } from "../../../../core/components/kit/Typography/Typography";
import { getConfig } from "../../../../core/services/main.service";

type InfoProps = {
  configId: string;
};

export const Info: FC<InfoProps> = ({ configId }) => {
  const { data: configData } = useQuery([GetByIdConfigsPath], () => getConfig({ id: configId }), {
    enabled: !!configId,
  });

  return (
    <div>
      <Typography variant="h4" marginBottom>
        {configData?.data.config.title}
      </Typography>
      {/* <Typography variant="h5">{configData?.data.config.data}</Typography> */}
    </div>
  );
};
