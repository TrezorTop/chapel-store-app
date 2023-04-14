import { CheckMyPaymentsPath, CheckMyPaymentsResponse } from "../../../../shared/endpoints/me/checkMyPayments";
import {
  GetMyBundlesPath,
  GetMyBundlesQuery,
  GetMyBundlesResponse,
} from "../../../../shared/endpoints/me/getMyBundles";
import { GetMyInfoPath, GetMyInfoResponse } from "../../../../shared/endpoints/me/myInfo";
import { api } from "../config/api";
import { USER_ACCESS_TOKEN_KEY } from "../utils/consts/consts";

export const getProfileBundles = (data: GetMyBundlesQuery) =>
  api.get<GetMyBundlesResponse>(GetMyBundlesPath, { params: data });
export const getMyProfileInfo = () =>
  api.get<GetMyInfoResponse>(GetMyInfoPath, {
    headers: {
      authorization: `Bearer ${localStorage.getItem(USER_ACCESS_TOKEN_KEY)}`,
    },
  });

export const checkMyPayments = () => api.get<CheckMyPaymentsResponse>(CheckMyPaymentsPath);
