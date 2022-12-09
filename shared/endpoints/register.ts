import { AuthBasePath, BasePath } from "../index";


export const RegisterBasePath = "/register";

export const RegisterPath = `${BasePath}${AuthBasePath}${RegisterBasePath}`;

export type RegisterRequest = {
	username: string;
	password: string;
};

export type RegisterResponse = {
	accessToken: string;
	refreshToken: string;
};
