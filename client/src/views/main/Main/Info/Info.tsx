import { useQuery } from "@tanstack/react-query";
import { FC, useEffect } from "react";

import { GetByIdConfigsPath } from "../../../../../../shared/endpoints/configs/getById";
import { Button } from "../../../../core/components/kit/Button/Button";
import { Paper } from "../../../../core/components/kit/Paper/Paper";
import { Typography } from "../../../../core/components/kit/Typography/Typography";
import { getBundle } from "../../../../core/services/main.service";
import { formatCurrency } from "../../../../core/utils/functions/number";

import s from "./Info.module.scss";

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
      {configData?.data.bundle && (
        <>
          <Typography variant="h4" marginBottom>
            {configData?.data.bundle?.name}
          </Typography>
          <Typography variant="h5" marginBottom>
            {formatCurrency(+configData?.data.bundle?.price!)}
          </Typography>
          <div className={s.items}>
            {configData?.data.bundle?.configs.map((config) => (
              <Paper key={config.config.id}>
                <Typography variant="body1">{config.config.title}</Typography>
              </Paper>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
