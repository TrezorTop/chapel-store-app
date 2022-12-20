import { BasePath, BundlesBasePath } from "../../index";


export const GetAllBasePath = "/";

export const GetAllPath = `${BasePath}${BundlesBasePath}${GetAllBasePath}`;

export type GetAllResponse = {
	bundles: {
		id: string,
		name: string
	}[]
};
