import { BasePath, ConfigsRootPath } from "../../index";


export const GetConfigFileBasePath = "/getFileEncoded/:id";

export const GetConfigFilePath = `${BasePath}${ConfigsRootPath}${GetConfigFileBasePath}`;

export type GetConfigFileParams = {
	id: string
}

export type GetConfigFileResponse = string;
