import { AuthRootPath, BasePath } from "../../index";
import { Validator } from "../../types";
import { makeOptionalValidator } from "../../utils";
import { RegisterRequestValidator } from "./register";


export const LoginBasePath = "/login";

export const LoginPath = `${BasePath}${AuthRootPath}${LoginBasePath}`;

export const LoginRequestValidator: Validator<LoginRequest> = makeOptionalValidator(RegisterRequestValidator);

export type LoginRequest = {
	username: string;
	password: string;
};

export type LoginResponse = {
	accessToken: string;
	refreshToken: string;
};
