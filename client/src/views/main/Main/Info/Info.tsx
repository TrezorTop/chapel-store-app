import { useQuery } from "@tanstack/react-query";
import currency from "currency.js";
import { FC, useEffect } from "react";
import { GetByIdConfigsPath } from "../../../../../../shared/endpoints/configs/getById";

import { Typography } from "../../../../core/components/kit/Typography/Typography";
import { getBundle, getSetupById } from "../../../../core/services/main.service";

type InfoProps = {
  configId: string;
};

export const Info: FC<InfoProps> = ({ configId }) => {
  const { data: configData, refetch } = useQuery([GetByIdConfigsPath], () => getBundle({ id: configId }), {
    enabled: !!configId,
  });

  useEffect(() => {
    configId && refetch();
  }, [configId]);

  return (
    <div>
      <Typography variant="h4" marginBottom>
        <div>{configData?.data.bundle?.name}</div>
        <div>{currency(`${configData?.data.bundle?.price}`).format()}</div>
        <div>{configData?.data.bundle?.configs.map((config) => config.config.title)}</div>
      </Typography>
    </div>
  );
};
