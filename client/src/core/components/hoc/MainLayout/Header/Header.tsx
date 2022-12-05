import React from "react";
import { Paper } from "../../../ui/Paper/Paper";

import s from "./Header.module.scss";

export const Header = () => {
  return (
    <Paper>
      <div className={s.root}>
        <div>Logo</div> <div>User</div>
      </div>
    </Paper>
  );
};
