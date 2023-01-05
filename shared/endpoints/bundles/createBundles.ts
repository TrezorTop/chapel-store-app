import { BasePath, BundlesRootPath } from "../..";
import { Validator } from "../../types";


export const CreateBundlesBasePath = "";

export const CreateBundlesPath = `${BasePath}${BundlesRootPath}${CreateBundlesBasePath}`;

export const CreateBundlesRequestValidator: Validator<CreateBundlesRequest> = {
	name: {
		check: [
			value => value.length >= 1 || "Минимальная длина 1 символ",
			value => value.length <= 32 || "Максимальная длина 32 символа"
		],
		required: true
	}
};

export type CreateBundlesRequest = {
	name: string
}

export type CreateBundlesResponse = {
	bundle: {
		id: string,
		name: string
	}
};
