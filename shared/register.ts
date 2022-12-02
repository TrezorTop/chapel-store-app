import { AuthBasePath, BasePath } from "./index";


export const RegisterBasePath = "/register";

export const RegisterPath = `${BasePath}${AuthBasePath}${RegisterBasePath}`;

export type RegisterRequest = {
	username: string
}

export type RegisterResponse = {
	accessToken: string
}