import { Switch } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useDarkMode } from "usehooks-ts";
import { ColorModeContext } from "../../../../../../App";
import { ABOUT_URL, API_URL, COLOR_THEME_KEY, MAIN_URL } from "../../../../../utils/consts/urls";
import { Button } from "../../../../kit/Button/Button";

import s from "./Footer.module.scss";

export const Footer = () => {
  const { isDarkMode, toggle, enable } = useDarkMode();

  const navigate = useNavigate();

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
        <div>
          <Button variant="text" onClick={() => navigate(`${MAIN_URL}/${ABOUT_URL}`)}>
            FAQ
          </Button>
          <Button variant="text" onClick={() => window.open(`${API_URL}/terms_of_use.pdf`, "_blank")}>
            TERMS OF USE
          </Button>
          <Button variant="text" onClick={() => window.open(`https://discord.gg/AzvqMC9tgq`, "_blank")}>
            DISCORD
          </Button>
        </div>
        <div>
          Theme
          <Switch
            checked={isDarkMode}
            onChange={(event) => {
              colorMode.toggleColorMode();
              toggle();
            }}
          />
        </div>
      </div>
    </div>
  );
};
