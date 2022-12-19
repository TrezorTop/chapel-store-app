import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

import s from "./GlobalLoader.module.scss";

export const GlobalLoader = () => {
  return (
    <motion.div
      className={s.root}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <CircularProgress />
    </motion.div>
  );
};
