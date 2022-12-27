import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

import { ErrorResponse } from "../../../../shared/consts/error";
import { GetAllBundlesPath, GetAllBundlesResponse } from "../../../../shared/endpoints/bundles/getAllBundles";
import {
  GetAllConfigsParams,
  GetAllConfigsPath,
  GetAllConfigsResponse,
} from "../../../../shared/endpoints/configs/getAllConfigs";
import { api } from "../config/api";
import { buildRequestUrl } from "../utils/functions/api";

export const useConfigs = () => {
  return {
    get: useMutation<AxiosResponse<GetAllConfigsResponse>, AxiosError<ErrorResponse>, GetAllConfigsParams>(
      [GetAllConfigsPath],
      ({ bundleId, carId }) => api.get(buildRequestUrl(GetAllConfigsPath, { bundleId, carId })),
    ),
  };
};
