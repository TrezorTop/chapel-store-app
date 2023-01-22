import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { GetMyInfoPath } from "../../../../../../../../shared/endpoints/me/myInfo";
import { getMyProfileInfo } from "../../../../../services/profile.service";
import {
  AUTH_URL,
  CREATOR_URL,
  EDIT_ENTITIES_CARS_URL,
  EDIT_ENTITIES_URL,
  MAIN_URL,
  PROFILE_URL,
  USER_REFRESH_TOKEN_KEY,
} from "../../../../../utils/consts/urls";
import { removeAuthTokens } from "../../../../../utils/functions/auth";
import { Button } from "../../../../kit/Button/Button";
import s from "./Header.module.scss";

export const Header = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const navigate = useNavigate();

  const { data } = useQuery([GetMyInfoPath], getMyProfileInfo, {
    enabled: !!localStorage.getItem(USER_REFRESH_TOKEN_KEY),
    retry: !!localStorage.getItem(USER_REFRESH_TOKEN_KEY),
    onSuccess: () => {
      setAuthenticated(true);
    },
    onError: () => {
      setAuthenticated(false);
    },
  });

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
        </div>

        <div className={s.container}>
          {authenticated && data?.data.me?.role === "ADMIN" && (
            <Button
              variant="text"
              onClick={() => {
                navigate(`${CREATOR_URL}/${EDIT_ENTITIES_URL}/${EDIT_ENTITIES_CARS_URL}`);
              }}
            >
              Creator Panel
            </Button>
          )}

          {authenticated && (
            <Button
              variant="text"
              onClick={() => {
                navigate(PROFILE_URL);
              }}
            >
              Profile
            </Button>
          )}

          {authenticated ? (
            <Button
              variant="outlined"
              onClick={() => {
                removeAuthTokens();
                setAuthenticated(false);
              }}
              color="error"
            >
              Log Out
            </Button>
          ) : (
            <Button
              variant="outlined"
              onClick={() => {
                navigate(AUTH_URL);
              }}
              color="secondary"
            >
              Log In
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
