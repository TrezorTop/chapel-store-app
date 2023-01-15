import { useQuery } from "@tanstack/react-query";
import { FC, useEffect } from "react";

import { GetByIdConfigsPath } from "../../../../../../shared/endpoints/configs/getById";
import { Typography } from "../../../../core/components/kit/Typography/Typography";
import { getBundle } from "../../../../core/services/main.service";
import { formatCurrency } from "../../../../core/utils/functions/number";

type InfoProps = {
  bundleId: string;
};

export const Info: FC<InfoProps> = ({ bundleId }) => {
  const { data: configData, refetch } = useQuery([GetByIdConfigsPath], () => getBundle({ id: bundleId }), {
    enabled: !!bundleId,
  });

  useEffect(() => {
    bundleId && refetch();
  }, [bundleId]);

  return (
    <div>
      {configData && (
        <>
          <Typography variant="h4" marginBottom>
            {configData?.data.bundle?.name}
          </Typography>
          <Typography variant="h4">{formatCurrency(+configData?.data.bundle?.price!)}</Typography>
          <Typography variant="h4">{configData?.data.bundle?.configs.map((config) => config.config.title)}</Typography>
        </>
      )}
    </div>
  );
};
