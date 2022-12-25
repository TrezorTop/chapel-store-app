import { BasePath, ConfigsRootPath } from "../../index";


export const GetAllConfigsBasePath = "";

export const GetAllConfigsPath = `${BasePath}${ConfigsRootPath}${GetAllConfigsBasePath}`;

export type GetAllConfigsParams = {
	carId: string,
	bundleId: string
}

export type GetAllConfigsResponse = {
	configs: {
		id: string,
		title: string,
		data: string
	}[]
};
