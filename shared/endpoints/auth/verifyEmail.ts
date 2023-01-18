import { AuthRootPath, BasePath } from "../../index";
import { Validator } from "../../types";


export const VerifyEmailBasePath = "/verifyEmail";

export const VerifyEmailPath = `${BasePath}${AuthRootPath}${VerifyEmailBasePath}`;

export const VerifyEmailRequestValidator: Validator<VerifyEmailRequest> = {
	token: {
		check: [],
		required: true
	}
};

export type VerifyEmailRequest = {
	token: number;
};

export type VerifyEmailResponse = {};