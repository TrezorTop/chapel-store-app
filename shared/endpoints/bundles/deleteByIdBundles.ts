import { BasePath, BundlesRootPath } from "../../index";


export const DeleteByIdBundlesBasePath = "/:id";

export const DeleteByIdBundlesPath = `${BasePath}${BundlesRootPath}${DeleteByIdBundlesBasePath}`;

export type DeleteByIdBundlesParams = { id: string };

export type DeleteByIdBundlesResponse = {
	configs?: {
		id: string,
		title: string
	}[]
};
