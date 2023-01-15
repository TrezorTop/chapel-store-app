import { GetMyBundlesPath, GetMyBundlesResponse } from "../../../../shared/endpoints/me/getMyConfigs";
import { GetMyInfoPath, GetMyInfoResponse } from "../../../../shared/endpoints/me/myInfo";
import { api } from "../config/api";
import { USER_ACCESS_TOKEN_KEY } from "../utils/consts/urls";

export const getProfileBundles = () => api.get<GetMyBundlesResponse>(GetMyBundlesPath);
export const getMyProfileInfo = () =>
  api.get<GetMyInfoResponse>(GetMyInfoPath, {
    headers: {
      authorization: `Bearer ${localStorage.getItem(USER_ACCESS_TOKEN_KEY)}`,
    },
  });
