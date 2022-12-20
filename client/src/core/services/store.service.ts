import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

import { ErrorResponse } from "../../../../shared/consts/error";
import {
  BundlesPath,
  BundlesResponse,
} from "../../../../shared/endpoints/bundles/getAll";
import {
  CarsPath,
  CarsResponse,
} from "../../../../shared/endpoints/cars/getAll";
import {
  ConfigParams,
  ConfigPath,
  ConfigResponse,
} from "../../../../shared/endpoints/configs/getOne";
import { api } from "../config/api";
import { buildRequestUrl } from "../utils/functions/api";

export const useCars = () => {
  return useMutation<AxiosResponse<CarsResponse>, AxiosError<ErrorResponse>>(
    [CarsPath],
    () => api.get(CarsPath),
  );
};

export const useBundles = () => {
  return useMutation<AxiosResponse<BundlesResponse>, AxiosError<ErrorResponse>>(
    [BundlesPath],
    () => api.get(BundlesPath),
  );
};

export const useConfig = () => {
  return useMutation<
    AxiosResponse<ConfigResponse>,
    AxiosError<ErrorResponse>,
    ConfigParams
  >([ConfigPath], (data) => api.get(buildRequestUrl(ConfigPath, data)));
};
