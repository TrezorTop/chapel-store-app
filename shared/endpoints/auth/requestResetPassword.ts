import { AuthRootPath, BasePath } from "../../index";
import { Validator } from "../../types";
import { RegisterRequestValidator } from "./register";


export const RequestResetPasswordBasePath = "/requestResetPassword";

export const RequestResetPasswordPath = `${BasePath}${AuthRootPath}${RequestResetPasswordBasePath}`;

export const RequestResetPasswordRequestValidator: Validator<RequestResetPasswordRequest> = {
	email: RegisterRequestValidator["email"]
};

export type RequestResetPasswordRequest = {
	email: string;
};

export type RequestResetPasswordResponse = {};
