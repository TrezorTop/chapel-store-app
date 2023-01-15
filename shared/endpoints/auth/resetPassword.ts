import { AuthRootPath, BasePath } from "../../index";
import { Validator } from "../../types";
import { RegisterRequestValidator } from "./register";


export const ResetPasswordBasePath = "/resetPassword";

export const ResetPasswordPath = `${BasePath}${AuthRootPath}${ResetPasswordBasePath}`;

export const ResetPasswordRequestValidator: Validator<ResetPasswordRequest> = {
	email: RegisterRequestValidator["email"]
};

export type ResetPasswordRequest = {
	email: string;
};

export type ResetPasswordResponse = {};
