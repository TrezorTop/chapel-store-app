import { BasePath, BundlesRootPath } from "../../index";


export const BundlesBasePath = "";

export const BundlesPath = `${BasePath}${BundlesRootPath}${BundlesBasePath}`;

export type BundlesResponse = {
	bundles: {
		id: string,
		name: string
	}[]
};
