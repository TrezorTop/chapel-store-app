import { BasePath, CarsRootPath } from "../../index";
import { Validator } from "../../types";


export const CreateBundlesBasePath = "";

export const CreateBundlesPath = `${BasePath}${CarsRootPath}${CreateBundlesBasePath}`;

export const CreateBundlesRequestValidator: Validator<CreateBundlesRequest> = {
	name: [
		value => value.length >= 1 || "Минимальная длина 1 символ",
		value => value.length <= 32 || "Максимальная длина 32 символа"
	]
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
