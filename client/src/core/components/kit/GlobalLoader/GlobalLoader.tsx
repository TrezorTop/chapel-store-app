import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import React, { FC, useEffect, useState } from "react";
import { Paper } from "../Paper/Paper";

import s from "./GlobalLoader.module.scss";

type GlobalLoaderProps = {
  showLoader?: boolean;
};

export const GlobalLoader: FC<GlobalLoaderProps> = ({ showLoader = true }) => {
  return (
    <motion.div
      className={s.root}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {showLoader && <CircularProgress />}
      <Paper className={s.message}>Network Error</Paper>
    </motion.div>
  );
};
