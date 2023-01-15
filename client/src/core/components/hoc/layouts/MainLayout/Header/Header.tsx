import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router-dom";
import { General_Unauthorized } from "../../../../../../../../shared/consts/error";

import { RefreshPath } from "../../../../../../../../shared/endpoints/auth/refresh";
import { GetMyInfoPath } from "../../../../../../../../shared/endpoints/me/myInfo";
import { getMyProfileInfo } from "../../../../../services/profile.service";
import { refreshToken } from "../../../../../services/user.service";
import {
  AUTH_URL,
  CREATOR_URL,
  EDIT_ENTITIES_CARS_URL,
  EDIT_ENTITIES_URL,
  MAIN_URL,
  PROFILE_URL,
  USER_ACCESS_TOKEN_KEY,
  USER_REFRESH_TOKEN_KEY,
} from "../../../../../utils/consts/urls";
import { removeAuthTokens, updateAuthTokens } from "../../../../../utils/functions/auth";
import { Button } from "../../../../kit/Button/Button";
import s from "./Header.module.scss";

export const Header = () => {
  const navigate = useNavigate();

  const { mutate: mutateRefreshToken } = useMutation(
    [RefreshPath],
    () => refreshToken({ refreshToken: localStorage.getItem(USER_REFRESH_TOKEN_KEY) ?? "" }),
    {
      onSuccess: ({ data }) => {
        updateAuthTokens(data.accessToken);
      },
    },
  );

  const { data, refetch, isSuccess, isError } = useQuery([GetMyInfoPath], getMyProfileInfo, {
    enabled: !!localStorage.getItem(USER_ACCESS_TOKEN_KEY),
    retry: false,
    onError: (error) => {
      if (error.response.data.message === General_Unauthorized) {
        mutateRefreshToken();
      }
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
                refetch();
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
