import { GetMyConfigsPath, GetMyConfigsResponse } from "../../../../shared/endpoints/me/getMyConfigs";
import { GetMyInfoPath, GetMyInfoResponse } from "../../../../shared/endpoints/me/myInfo";
import { api } from "../config/api";
import { USER_ACCESS_TOKEN_KEY } from "../utils/consts/urls";

export const getProfileConfigs = () => api.get<GetMyConfigsResponse>(GetMyConfigsPath);
export const getMyProfileInfo = () =>
  api.get<GetMyInfoResponse>(GetMyInfoPath, {
    headers: {
      authorization: `Bearer ${localStorage.getItem(USER_ACCESS_TOKEN_KEY)}`,
    },
  });
