import { BasePath } from "./index";


export const AuthPath = `${BasePath}/auth`;

export const RegisterPath = `${AuthPath}/register`;


export type RegisterRequest = {
	username: string
}

export type RegisterResponse = {
	accessToken: string
}