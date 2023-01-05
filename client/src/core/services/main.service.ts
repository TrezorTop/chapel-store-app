import {
  CreateBundlesPath,
  CreateBundlesRequest,
  CreateBundlesResponse,
} from "../../../../shared/endpoints/bundles/createBundles";
import { DeleteByIdBundlesParams, DeleteByIdBundlesPath } from "../../../../shared/endpoints/bundles/deleteByIdBundles";
import { GetAllBundlesPath, GetAllBundlesResponse } from "../../../../shared/endpoints/bundles/getAllBundles";
import {
  GetByIdBundlesParams,
  GetByIdBundlesPath,
  GetByIdBundlesResponse,
} from "../../../../shared/endpoints/bundles/getByIdBundles";
import {
  UpdateBundlesParams,
  UpdateBundlesPath,
  UpdateBundlesRequest,
  UpdateBundlesResponse,
} from "../../../../shared/endpoints/bundles/updateBundles";
import { CreateCarsPath, CreateCarsRequest, CreateCarsResponse } from "../../../../shared/endpoints/cars/createCars";
import {
  DeleteByIdCarsParams,
  DeleteByIdCarsPath,
  DeleteByIdCarsResponse,
} from "../../../../shared/endpoints/cars/deleteByIdCars";
import { GetAllCarsPath, GetAllCarsResponse } from "../../../../shared/endpoints/cars/getAllCars";
import { GetByIdCarsParams, GetByIdCarsPath, GetByIdCarsResponse } from "../../../../shared/endpoints/cars/getByIdCars";
import {
  UpdateCarsParams,
  UpdateCarsPath,
  UpdateCarsRequest,
  UpdateCarsResponse,
} from "../../../../shared/endpoints/cars/updateCars";
import {
  CreateConfigsPath,
  CreateConfigsRequest,
  CreateConfigsResponse,
} from "../../../../shared/endpoints/configs/createConfigs";
import {
  DeleteByIdConfigsParams,
  DeleteByIdConfigsPath,
  DeleteByIdConfigsResponse,
} from "../../../../shared/endpoints/configs/deleteByIdConfigs";
import {
  GetAllConfigsPath,
  GetAllConfigsQuery,
  GetAllConfigsResponse,
} from "../../../../shared/endpoints/configs/getAllConfigs";
import {
  GetByIdConfigsParams,
  GetByIdConfigsPath,
  GetByIdConfigsResponse,
} from "../../../../shared/endpoints/configs/getById";
import {
  UpdateConfigsParams,
  UpdateConfigsPath,
  UpdateConfigsRequest,
  UpdateConfigsResponse,
} from "../../../../shared/endpoints/configs/updateConfigs";
import { api } from "../config/api";
import { buildRequestUrl } from "../utils/functions/api";

export const getConfigs = ({ bundleId, carId }: GetAllConfigsQuery) =>
  api.get<GetAllConfigsResponse>(buildRequestUrl(GetAllConfigsPath, { bundleId, carId }));
export const getConfig = ({ id }: GetByIdConfigsParams) =>
  api.get<GetByIdConfigsResponse>(GetByIdConfigsPath.replace(":id", id));
export const createConfig = ({ bundleId, carId, data, title }: CreateConfigsRequest) =>
  api.post<CreateConfigsResponse>(CreateConfigsPath, {
    bundleId,
    carId,
    data,
    title,
  });
export const updateConfig = ({ id, bundleId, carId, data, title }: UpdateConfigsParams & UpdateConfigsRequest) =>
  api.put<UpdateConfigsResponse>(UpdateConfigsPath.replace(":id", id), { bundleId, carId, data, title });
export const deleteConfig = ({ id }: DeleteByIdConfigsParams) =>
  api.delete<DeleteByIdConfigsResponse>(DeleteByIdConfigsPath.replace(":id", id));

export const getBundles = () => api.get<GetAllBundlesResponse>(GetAllBundlesPath);
export const getBundle = ({ id }: GetByIdBundlesParams) =>
  api.get<GetByIdBundlesResponse>(GetByIdBundlesPath.replace(":id", id));
export const createBundle = ({ name }: CreateBundlesRequest) =>
  api.post<CreateBundlesResponse>(CreateBundlesPath, {
    name,
  });
export const updateBundle = ({ id, name }: UpdateBundlesParams & UpdateBundlesRequest) =>
  api.put<UpdateBundlesResponse>(UpdateBundlesPath.replace(":id", id), { name });
export const deleteBundle = ({ id }: DeleteByIdBundlesParams) => api.delete(DeleteByIdBundlesPath.replace(":id", id));

export const getCars = () => api.get<GetAllCarsResponse>(GetAllCarsPath);
export const getCar = ({ id }: GetByIdCarsParams) => api.get<GetByIdCarsResponse>(GetByIdCarsPath.replace(":id", id));
export const createCar = ({ name }: CreateCarsRequest) =>
  api.post<CreateCarsResponse>(CreateCarsPath, {
    name,
  });
export const updateCar = ({ id, name }: UpdateCarsParams & UpdateCarsRequest) =>
  api.put<UpdateCarsResponse>(UpdateCarsPath.replace(":id", id), { name });
export const deleteCar = ({ id }: DeleteByIdCarsParams) =>
  api.delete<DeleteByIdCarsResponse, DeleteByIdCarsResponse, DeleteByIdCarsResponse>(
    DeleteByIdCarsPath.replace(":id", id),
  );
