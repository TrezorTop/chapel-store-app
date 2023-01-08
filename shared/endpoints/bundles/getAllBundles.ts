import { BasePath, BundlesRootPath } from "../../index";


export const GetAllBundlesBasePath = "";

export const GetAllBundlesPath = `${BasePath}${BundlesRootPath}${GetAllBundlesBasePath}`;

export type GetAllBundlesResponse = {
	bundles: {
		id: string,
		name: string,
		configs: {
			id: string,
			title: string
		}[]
	}[]
};
