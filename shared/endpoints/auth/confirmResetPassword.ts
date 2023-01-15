import { AuthRootPath, BasePath } from "../../index";
import { Validator } from "../../types";
import { RegisterRequestValidator } from "./register";


export const ConfirmResetPasswordBasePath = "/confirmResetPassword";

export const ConfirmResetPasswordPath = `${BasePath}${AuthRootPath}${ConfirmResetPasswordBasePath}`;

export const ConfirmResetPasswordValidator: Validator<ConfirmResetPasswordRequest> = {
	password: RegisterRequestValidator.password,
	token: {
		check: [],
		required: true
	}
};

export type ConfirmResetPasswordRequest = {
	token: string;
	password: string;
};

export type ConfirmResetPasswordResponse = {};
