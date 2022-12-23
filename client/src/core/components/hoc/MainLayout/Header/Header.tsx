import React from "react";
import { useNavigate } from "react-router-dom";

import { usePing } from "../../../../services/auth.service";
import { CREATOR_URL, MAIN_URL, PROFILE_URL, SIGN_IN_URL } from "../../../../utils/consts";
import { removeAuthTokens } from "../../../../utils/functions/auth";
import { Button } from "../../../kit/Button/Button";
import s from "./Header.module.scss";

export const Header = () => {
  const navigate = useNavigate();

  const { mutate } = usePing();

  return (
    <div className={s.root}>
      <div className={s.content}>
        <div className={s.container}>
          <Button
            variant="text"
            onClick={() => {
              navigate(MAIN_URL);
            }}
          >
            MAIN
          </Button>
          <Button variant="contained" onClick={() => mutate()}>
            ping server
          </Button>
        </div>
        <div className={s.container}>
          <Button
            variant="text"
            onClick={() => {
              navigate(CREATOR_URL);
            }}
          >
            Creator Panel
          </Button>
          <Button
            variant="text"
            onClick={() => {
              navigate(PROFILE_URL);
            }}
          >
            Profile
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              navigate(SIGN_IN_URL);
              removeAuthTokens();
            }}
          >
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
};
