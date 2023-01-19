import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { ErrorResponse, General_Unauthorized } from "../../../../../../../../shared/consts/error";
import { GetMyInfoPath } from "../../../../../../../../shared/endpoints/me/myInfo";
import { getMyProfileInfo } from "../../../../../services/profile.service";
import {
  AUTH_URL,
  CREATOR_URL,
  EDIT_ENTITIES_CARS_URL,
  EDIT_ENTITIES_URL,
  HTTP_BROADCAST_KEY,
  MAIN_URL,
  PROFILE_URL,
  USER_ACCESS_TOKEN_KEY,
} from "../../../../../utils/consts/urls";
import { removeAuthTokens } from "../../../../../utils/functions/auth";
import { Button } from "../../../../kit/Button/Button";
import s from "./Header.module.scss";

export const Header = () => {
  const navigate = useNavigate();

  const { data, mutate, isSuccess, isError } = useMutation([GetMyInfoPath], getMyProfileInfo, {
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response?.data.message === General_Unauthorized) {
        const broadcast = new BroadcastChannel(HTTP_BROADCAST_KEY);

        broadcast.postMessage(error.response?.data.message);

        broadcast.close();
      }
    },
  });

  useEffect(() => {
    !!localStorage.getItem(USER_ACCESS_TOKEN_KEY) && mutate();
  }, []);

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
          {isSuccess && data?.data.me?.role === "ADMIN" && (
            <Button
              variant="text"
              onClick={() => {
                navigate(`${CREATOR_URL}/${EDIT_ENTITIES_URL}/${EDIT_ENTITIES_CARS_URL}`);
              }}
            >
              Creator Panel
            </Button>
          )}

          {isSuccess && (
            <Button
              variant="text"
              onClick={() => {
                navigate(PROFILE_URL);
              }}
            >
              Profile
            </Button>
          )}

          {isSuccess ? (
            <Button
              variant="outlined"
              onClick={() => {
                removeAuthTokens();
                mutate();
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
