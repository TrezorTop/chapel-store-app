import { BasePath, BundlesRootPath } from "../../index";


export const GetBundleFilesBasePath = "/:id/files";

export const GetBundleFilesPath = `${BasePath}${BundlesRootPath}${GetBundleFilesBasePath}`;

export type GetBundleFilesParams = {
	id: string
}

export type GetBundleFilesResponse = string;
