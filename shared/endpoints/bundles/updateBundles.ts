import { BasePath, CarsRootPath } from "../../index";
import { Validator } from "../../types";
import { CreateBundlesRequestValidator } from "./createBundles";


export const UpdateBundlesBasePath = "/:id";

export const UpdateBundlesPath = `${BasePath}${CarsRootPath}${UpdateBundlesBasePath}`;

export const UpdateBundlesRequestValidator: Validator<UpdateBundlesRequest> = {
	name: CreateBundlesRequestValidator.name
};

export type UpdateBundlesParams = {
	id: string
}

export type UpdateBundlesRequest = {
	name: string
}

export type UpdateBundlesResponse = {
	bundle: {
		id: string,
		name: string
	}
};
