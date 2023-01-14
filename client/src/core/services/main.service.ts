import {
  CreateBundlesPath,
  CreateBundlesRequest,
  CreateBundlesResponse,
} from "../../../../shared/endpoints/bundles/createBundles";
import { DeleteByIdBundlesParams, DeleteByIdBundlesPath } from "../../../../shared/endpoints/bundles/deleteByIdBundles";
import {
  GetAllBundlesPath,
  GetAllBundlesQuery,
  GetAllBundlesResponse,
} from "../../../../shared/endpoints/bundles/getAllBundles";
import {
  GetBundleFilesBasePath,
  GetBundleFilesParams,
  GetBundleFilesResponse,
} from "../../../../shared/endpoints/bundles/getBundleFiles";
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
import { CreateConfigsPath, CreateConfigsResponse } from "../../../../shared/endpoints/configs/createConfigs";
import {
  DeleteByIdConfigsParams,
  DeleteByIdConfigsPath,
  DeleteByIdConfigsResponse,
} from "../../../../shared/endpoints/configs/deleteByIdConfigs";
import { GetAllConfigsPath, GetAllConfigsResponse } from "../../../../shared/endpoints/configs/getAllConfigs";
import {
  GetByIdConfigsParams,
  GetByIdConfigsPath,
  GetByIdConfigsResponse,
} from "../../../../shared/endpoints/configs/getById";
import {
  UpdateConfigsParams,
  UpdateConfigsPath,
  UpdateConfigsResponse,
} from "../../../../shared/endpoints/configs/updateConfigs";
import { api } from "../config/api";
import { buildRequestUrl } from "../utils/functions/api";

export const getSetups = () => api.get<GetAllConfigsResponse>(GetAllConfigsPath);
export const getSetupById = ({ id }: GetByIdConfigsParams) =>
  api.get<GetByIdConfigsResponse>(GetByIdConfigsPath.replace(":id", id));
export const createSetup = (formData: FormData) =>
  api.post<CreateConfigsResponse>(CreateConfigsPath, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const updateSetup = ({ id }: UpdateConfigsParams, formData: FormData) =>
  api.put<UpdateConfigsResponse>(UpdateConfigsPath.replace(":id", id), formData);
export const deleteSetup = ({ id }: DeleteByIdConfigsParams) =>
  api.delete<DeleteByIdConfigsResponse>(DeleteByIdConfigsPath.replace(":id", id));

export const getBundles = (data: GetAllBundlesQuery) =>
  api.get<GetAllBundlesResponse>(buildRequestUrl(GetAllBundlesPath, data));
export const getBundle = ({ id }: GetByIdBundlesParams) =>
  api.get<GetByIdBundlesResponse>(GetByIdBundlesPath.replace(":id", id));
export const createBundle = (data: CreateBundlesRequest) => api.post<CreateBundlesResponse>(CreateBundlesPath, data);
export const updateBundle = ({ id, ...data }: UpdateBundlesParams & UpdateBundlesRequest) =>
  api.put<UpdateBundlesResponse>(UpdateBundlesPath.replace(":id", id), data);
export const deleteBundle = ({ id }: DeleteByIdBundlesParams) => api.delete(DeleteByIdBundlesPath.replace(":id", id));
export const getBundleFiles = ({ id }: GetBundleFilesParams) =>
  api.get<GetBundleFilesResponse>(GetBundleFilesBasePath.replace(":id", id));

export const getCars = () => api.get<GetAllCarsResponse>(GetAllCarsPath);
export const getCar = ({ id }: GetByIdCarsParams) => api.get<GetByIdCarsResponse>(GetByIdCarsPath.replace(":id", id));
export const createCar = (data: CreateCarsRequest) => api.post<CreateCarsResponse>(CreateCarsPath, data);
export const updateCar = ({ id, ...data }: UpdateCarsParams & UpdateCarsRequest) =>
  api.put<UpdateCarsResponse>(UpdateCarsPath.replace(":id", id), data);
export const deleteCar = ({ id }: DeleteByIdCarsParams) =>
  api.delete<DeleteByIdCarsResponse>(DeleteByIdCarsPath.replace(":id", id));
