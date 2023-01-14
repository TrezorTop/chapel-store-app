import { Decimal } from "../../../server/src/infrastructure/prismaConnect";
import { BasePath, BundlesRootPath } from "../../index";
import { Validator } from "../../types";
import { makeOptionalValidator } from "../../utils";
import { CreateBundlesRequestValidator } from "./createBundles";


export const UpdateBundlesBasePath = "/:id";

export const UpdateBundlesPath = `${BasePath}${BundlesRootPath}${UpdateBundlesBasePath}`;

export const UpdateBundlesRequestValidator: Validator<UpdateBundlesRequest> = makeOptionalValidator(CreateBundlesRequestValidator);

export type UpdateBundlesParams = {
	id: string
}

export type UpdateBundlesRequest = {
	name?: string
	price?: number,
	configs?: string[]
}

export type UpdateBundlesResponse = {
	bundle: {
		id: string,
		name: string,
		price: Decimal
	}
};
