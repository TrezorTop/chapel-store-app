import { AuthRootPath, BasePath } from "../../index";


export const LoginBasePath = "/login";

export const LoginPath = `${BasePath}${AuthRootPath}${LoginBasePath}`;

export type LoginRequest = {
	username: string;
	password: string;
};

export type LoginResponse = {
	accessToken: string;
	refreshToken: string;
};
