import { Switch } from "@mui/material";
import React, { useEffect } from "react";
import { useDarkMode } from "usehooks-ts";
import { ColorModeContext } from "../../../../../../App";

import s from "./Footer.module.scss";

export const Footer = () => {
  const { isDarkMode, toggle, enable, disable } = useDarkMode();

  const colorMode = React.useContext(ColorModeContext);

  return (
    <div className={s.root}>
      <div className={s.content}>
        Toggle Theme{" "}
        <Switch
          checked={isDarkMode}
          onChange={(event) => {
            colorMode.toggleColorMode();
            if (event.target.checked) {
              enable();
            } else {
              disable();
            }
          }}
        />
      </div>
    </div>
  );
};
