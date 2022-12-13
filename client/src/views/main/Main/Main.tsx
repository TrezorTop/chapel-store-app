import React from "react";

import { Typography } from "../../../core/components/kit/Typography/Typography";
import { Info } from "./Info/Info";
import s from "./Main.module.scss";
import { Selector } from "./Selector/Selector";

export const Main = () => {
  return (
    <>
      <Typography variant="h3" marginBottom>
        Choose Configuration
      </Typography>
      <div className={s.container}>
        <Selector />
        <Info />
      </div>
    </>
  );
};
