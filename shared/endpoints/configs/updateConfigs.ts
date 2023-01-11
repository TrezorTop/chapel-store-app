import { BasePath, ConfigsRootPath } from "../../index";
import { Validator } from "../../types";
import { makeOptionalValidator } from "../../utils";
import { CreateConfigsRequestValidator } from "./createConfigs";


export const UpdateConfigsBasePath = "/:id";

export const UpdateConfigsPath = `${BasePath}${ConfigsRootPath}${UpdateConfigsBasePath}`;

export const UpdateConfigsRequestValidator: Validator<UpdateConfigsRequest> = makeOptionalValidator(CreateConfigsRequestValidator);

export type UpdateConfigsParams = {
	id: string
}

export type UpdateConfigsRequest = {
	title?: string,
	data?: File[],
	softDeleted?: boolean,
	carId?: string,
	bundleId?: string
}

export type UpdateConfigsResponse = {
	config: {
		title: string,
		carId: string,
		bundleId: string,
		softDeleted: boolean
	}
};