import React from "react";
import { useNavigate } from "react-router-dom";

import { signInUrl } from "../../../../utils/consts";
import { destroyAuthToken } from "../../../../utils/functions/user";
import { Button } from "../../../ui/Button/Button";
import { Paper } from "../../../ui/Paper/Paper";
import s from "./Header.module.scss";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <Paper>
      <div className={s.root}>
        <div>Header</div>
        <div>
          <Button
            onClick={() => {
              destroyAuthToken();
              navigate(signInUrl);
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </Paper>
  );
};
