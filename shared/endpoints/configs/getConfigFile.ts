import { BasePath, ConfigsRootPath } from "../../index";


export const GetConfigFileBasePath = "/getFileEncoded/:name";

export const GetConfigFilePath = `${BasePath}${ConfigsRootPath}${GetConfigFileBasePath}`;

export type GetConfigFileParams = {
	name: string
}

export type GetConfigFileResponse = string;
