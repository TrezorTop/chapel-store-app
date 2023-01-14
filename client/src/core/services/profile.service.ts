import {
  GetByIdConfigsParams,
  GetByIdConfigsPath,
  GetByIdConfigsResponse,
} from "../../../../shared/endpoints/configs/getById";
import { GetMyConfigsPath, GetMyConfigsResponse } from "../../../../shared/endpoints/me/getMyConfigs";
import { api } from "../config/api";


export const getProfileConfigs = () => api.get<GetMyConfigsResponse>(GetMyConfigsPath);
export const getProfileConfigById = ({ id }: GetByIdConfigsParams) =>
  api.get<GetByIdConfigsResponse>(GetByIdConfigsPath.replace(":id", id));
