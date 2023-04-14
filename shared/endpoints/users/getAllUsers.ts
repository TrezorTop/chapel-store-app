import { BasePath, UsersRootPath } from "../../index";


export const GetAllUsersBasePath = "";

export const GetAllUsersPath = `${BasePath}${UsersRootPath}${GetAllUsersBasePath}`;

export type GetAllUsersQuery = {};

export type GetAllUsersResponse = {
	users: {
		username: string
	}[]
};