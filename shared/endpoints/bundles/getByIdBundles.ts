import { BasePath, BundlesRootPath } from "../../index";


export const GetByIdBundlesBasePath = "/:id";

export const GetByIdBundlesPath = `${BasePath}${BundlesRootPath}${GetByIdBundlesBasePath}`;

export type GetByIdBundlesParams = {
	id: string
}

export type GetByIdBundlesResponse = {
	bundle: {
		id: string,
		name: string,
		configs: {
			id: string,
			title: string
		}[]
	}
};
