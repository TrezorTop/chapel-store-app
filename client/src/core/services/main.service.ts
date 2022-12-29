import {
  CreateBundlesPath,
  CreateBundlesRequest,
  CreateBundlesResponse,
} from "../../../../shared/endpoints/bundles/createBundles";
import { DeleteByIdBundlesParams, DeleteByIdBundlesPath } from "../../../../shared/endpoints/bundles/deleteByIdBundles";
import { GetAllBundlesPath, GetAllBundlesResponse } from "../../../../shared/endpoints/bundles/getAllBundles";
import { CreateCarsPath, CreateCarsRequest, CreateCarsResponse } from "../../../../shared/endpoints/cars/createCars";
import {
  DeleteByIdCarsParams,
  DeleteByIdCarsPath,
  DeleteByIdCarsResponse,
} from "../../../../shared/endpoints/cars/deleteByIdCars";
import { GetAllCarsPath, GetAllCarsResponse } from "../../../../shared/endpoints/cars/getAllCars";
import {
  CreateConfigsPath,
  CreateConfigsRequest,
  CreateConfigsResponse,
} from "../../../../shared/endpoints/configs/createConfigs";
import {
  GetAllConfigsPath,
  GetAllConfigsQuery,
  GetAllConfigsResponse,
} from "../../../../shared/endpoints/configs/getAllConfigs";
import { api } from "../config/api";
import { buildRequestUrl } from "../utils/functions/api";

export const getConfigs = ({ bundleId, carId }: GetAllConfigsQuery) =>
  api.get<GetAllConfigsResponse>(buildRequestUrl(GetAllConfigsPath, { bundleId, carId }));
export const createConfig = ({ bundleId, carId, data, title }: CreateConfigsRequest) =>
  api.post<CreateConfigsResponse>(CreateConfigsPath, {
    bundleId,
    carId,
    data,
    title,
  });
// export const deleteConfig = () => api.delete()

export const getBundles = () => api.get<GetAllBundlesResponse>(GetAllBundlesPath);
export const createBundle = ({ name }: CreateBundlesRequest) =>
  api.post<CreateBundlesResponse>(CreateBundlesPath, {
    name,
  });
export const deleteBundle = ({ id }: DeleteByIdBundlesParams) => api.delete(DeleteByIdBundlesPath.replace(":id", id));

export const getCars = () => api.get<GetAllCarsResponse>(GetAllCarsPath);
export const createCar = ({ name }: CreateCarsRequest) =>
  api.post<CreateCarsResponse>(CreateCarsPath, {
    name,
  });
export const deleteCar = ({ id }: DeleteByIdCarsParams) =>
  api.delete<DeleteByIdCarsResponse, DeleteByIdCarsResponse, DeleteByIdCarsResponse>(
    DeleteByIdCarsPath.replace(":id", id),
  );
