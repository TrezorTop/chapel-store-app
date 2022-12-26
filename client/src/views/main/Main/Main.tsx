import React, { useState } from "react";
import { GetAllConfigsResponse } from "../../../../../shared/endpoints/configs/getAllConfigs";

import { Typography } from "../../../core/components/kit/Typography/Typography";
import { usePing } from "../../../core/services/user.service";
import { GetElementType } from "../../../core/utils/types/utilityTypes";
import { Info } from "./Info/Info";
import s from "./Main.module.scss";
import { Selector } from "./Selector/Selector";

export const Main = () => {
  const [config, setConfig] = useState<GetElementType<GetAllConfigsResponse["configs"]> | undefined>();

  return (
    <>
      <Typography variant="h4" marginBottom>
        Choose Configuration
      </Typography>
      <div className={s.container}>
        <Selector setConfig={setConfig} />
        <Info title={config?.title} data={config?.data} />
      </div>
    </>
  );
};
