import { CircularProgress } from "@mui/material";
import React from "react";

import s from "./GlobalLoader.module.scss";

export const GlobalLoader = () => {
  return (
    <div className={s.root}>
      <CircularProgress />
    </div>
  );
};
