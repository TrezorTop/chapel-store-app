import { GetAllUsersPath, GetAllUsersResponse } from "../../../../shared/endpoints/users/getAllUsers";
import { api } from "../config/api";

export const getAllUsers = () => api.get<GetAllUsersResponse>(GetAllUsersPath);
