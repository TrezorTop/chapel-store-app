import { BasePath, BundlesRootPath } from "../../index";


export const GetByIdConfigsBasePath = "/:id";

export const GetByIdConfigsPath = `${BasePath}${BundlesRootPath}${GetByIdConfigsBasePath}`;

export type GetByIdConfigsParams = {
	id: string
}

export type GetByIdConfigsResponse = {
	config: {
		id: string,
		title: string,
		data: string
	}
};
