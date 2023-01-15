import { Switch } from "@mui/material";
import React, { useEffect } from "react";
import { useDarkMode } from "usehooks-ts";
import { ColorModeContext } from "../../../../../../App";
import { COLOR_THEME_KEY } from "../../../../../utils/consts/urls";

import s from "./Footer.module.scss";

export const Footer = () => {
  const { isDarkMode, toggle, enable, disable } = useDarkMode();

  useEffect(() => {
    if (
      !localStorage.getItem(COLOR_THEME_KEY) &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      enable();
      colorMode.toggleColorMode();
    }
  }, []);

  const colorMode = React.useContext(ColorModeContext);

  return (
    <div className={s.root}>
      <div className={s.content}>
        Toggle Theme{" "}
        <Switch
          checked={isDarkMode}
          onChange={(event) => {
            colorMode.toggleColorMode();
            toggle();
          }}
        />
      </div>
    </div>
  );
};
