import { BasePath } from "../../index";


export const ConfigBasePath = "/";

export const ConfigPath = `${BasePath}${ConfigBasePath}${ConfigBasePath}`;

export type ConfigParams = {
	carId: string,
	bundleId: string
}

export type ConfigResponse = {
	config: {
		data: string
	}
};
