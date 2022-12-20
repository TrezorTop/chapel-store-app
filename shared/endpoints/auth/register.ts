import { AuthRootPath, BasePath } from "../../index";


export const RegisterBasePath = "/register";

export const RegisterPath = `${BasePath}${AuthRootPath}${RegisterBasePath}`;

export type RegisterRequest = {
	username: string;
	password: string;
};

export type RegisterResponse = {
	accessToken: string;
	refreshToken: string;
};
