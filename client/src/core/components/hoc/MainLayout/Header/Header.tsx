import React from "react";
import { useNavigate } from "react-router-dom";

import { ping } from "../../../../services/Auth.service";
import { mainUrl, profileUrl, signInUrl } from "../../../../utils/consts";
import { removeAuthTokens } from "../../../../utils/functions/auth";
import { Button } from "../../../kit/Button/Button";
import { Paper } from "../../../kit/Paper/Paper";
import s from "./Header.module.scss";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <Paper>
      <div className={s.root}>
        <div className={s.container}>
          <Button
            variant="text"
            onClick={() => {
              navigate(mainUrl);
            }}
          >
            MAIN
          </Button>
          <Button variant="contained" onClick={() => ping()}>
            ping server
          </Button>
        </div>
        <div className={s.container}>
          <Button
            variant="text"
            onClick={() => {
              navigate(profileUrl);
            }}
          >
            Profile
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              navigate(signInUrl);
              removeAuthTokens();
            }}
          >
            Log out
          </Button>
        </div>
      </div>
    </Paper>
  );
};
