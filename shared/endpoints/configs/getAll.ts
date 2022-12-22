import { BasePath, ConfigsRootPath } from "../../index";


export const GetAllConfigBasePath = "";

export const GetAllConfigPath = `${BasePath}${ConfigsRootPath}${GetAllConfigBasePath}`;

export type GetAllConfigParams = {
	carId: string,
	bundleId: string
}

export type GetAllConfigResponse = {
	configs: {
		id: string,
		title: string,
		data: string
	}[]
};
