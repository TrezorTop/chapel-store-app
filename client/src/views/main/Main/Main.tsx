import React, { useEffect, useState } from "react";

import { Typography } from "../../../core/components/kit/Typography/Typography";
import { FAQ_POPUP_KEY } from "../../../core/utils/consts/consts";
import { PopUp } from "../components/PopUp/PopUp";
import { Info } from "./Info/Info";
import s from "./Main.module.scss";
import { Selector } from "./Selector/Selector";

export const Main = () => {
  const [bundleId, setBundleId] = useState<string>("");

  return (
    <>
      <PopUp />
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
