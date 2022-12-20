import { AuthBasePath, BasePath } from "../../index";


export const LoginBasePath = "/login";

export const LoginPath = `${BasePath}${AuthBasePath}${LoginBasePath}`;

export type LoginRequest = {
	username: string;
	password: string;
};

export type LoginResponse = {
	accessToken: string;
	refreshToken: string;
};
