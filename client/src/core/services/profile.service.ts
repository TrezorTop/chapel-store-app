import {
  GetByIdConfigsParams,
  GetMyConfigByIdPath,
  GetMyConfigByIdResponse,
} from "../../../../shared/endpoints/me/getMyConfigById";
import { GetMyConfigsPath, GetMyConfigsResponse } from "../../../../shared/endpoints/me/getMyConfigs";
import { api } from "../config/api";

export const getMyConfigs = () => api.get<GetMyConfigsResponse>(GetMyConfigsPath);
export const getMyConfigById = ({ id }: GetByIdConfigsParams) =>
  api.get<GetMyConfigByIdResponse>(GetMyConfigByIdPath.replace(":id", id));
