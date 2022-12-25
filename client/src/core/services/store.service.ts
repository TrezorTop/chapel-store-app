import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

import { ErrorResponse } from "../../../../shared/consts/error";
import { GetAllBundlesPath, GetAllBundlesResponse } from "../../../../shared/endpoints/bundles/getAll";
import { GetAllCarsPath, GetAllCarsResponse } from "../../../../shared/endpoints/cars/getAll";
import {
  GetAllConfigParams,
  GetAllConfigPath,
  GetAllConfigResponse,
} from "../../../../shared/endpoints/configs/getAll";
import { api } from "../config/api";
import { buildRequestUrl } from "../utils/functions/api";

export const useCars = () => {
  return {
    get: useMutation<AxiosResponse<GetAllCarsResponse>, AxiosError<ErrorResponse>>([GetAllCarsPath], () =>
      api.get(GetAllCarsPath),
    ),
  };
};

export const useBundles = () => {
  return useMutation<AxiosResponse<GetAllBundlesResponse>, AxiosError<ErrorResponse>>([GetAllBundlesPath], () =>
    api.get(GetAllBundlesPath),
  );
};

export const useConfigs = () => {
  return useMutation<AxiosResponse<GetAllConfigResponse>, AxiosError<ErrorResponse>, GetAllConfigParams>(
    [GetAllConfigPath],
    (data) => api.get(buildRequestUrl(GetAllConfigPath, data)),
  );
};
