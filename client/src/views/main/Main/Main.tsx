import React, { useState } from "react";

import { GetAllConfigsResponse } from "../../../../../shared/endpoints/configs/getAllConfigs";
import { Typography } from "../../../core/components/kit/Typography/Typography";
import { GetElementType } from "../../../core/utils/types/utilityTypes";
import { Info } from "./Info/Info";
import s from "./Main.module.scss";
import { Selector } from "./Selector/Selector";

export const Main = () => {
  const [configId, setConfigId] = useState<string>("");

  return (
    <>
      <Typography variant="h4" marginBottom>
        Choose Configuration
      </Typography>
      <div className={s.container}>
        <Selector setSelectedConfig={setConfigId} />
        <Info configId={configId} />
      </div>
    </>
  );
};
