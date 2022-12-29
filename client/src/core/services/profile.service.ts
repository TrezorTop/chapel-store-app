import { GetAllConfigsPath, GetAllConfigsResponse } from "../../../../shared/endpoints/configs/getAllConfigs";
import { GetMyConfigsPath, GetMyConfigsResponse } from "../../../../shared/endpoints/me/getMyConfigs";
import { api } from "../config/api";

export const getMyConfigs = () => api.get<GetMyConfigsResponse>(GetMyConfigsPath);

export const getUserConfigs = () => api.get<GetAllConfigsResponse>(GetAllConfigsPath);
