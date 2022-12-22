import { BasePath, ConfigsRootPath } from "../../index";


export const ConfigBasePath = "";

export const ConfigPath = `${BasePath}${ConfigsRootPath}${ConfigBasePath}`;

export type ConfigParams = {
	carId: string,
	bundleId: string
}

export type ConfigResponse = {
	configs: {
		title: string,
		data: string
	}[]
};
