import React, { useState } from "react";

import { Typography } from "../../../core/components/kit/Typography/Typography";
import { Info } from "./Info/Info";
import s from "./Main.module.scss";
import { Selector } from "./Selector/Selector";

export const Main = () => {
  const [bundleId, setBundleId] = useState<string>("");

  return (
    <>
      <Typography variant="h4" marginBottom>
        Choose Setup
      </Typography>
      <div className={s.container}>
        <Selector setSelectedBundle={setBundleId} />
        <Info bundleId={bundleId} />
      </div>
    </>
  );
};
