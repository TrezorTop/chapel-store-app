import { BasePath, ConfigsRootPath } from "../../index";


export const GetAllConfigsBasePath = "";

export const GetAllConfigsPath = `${BasePath}${ConfigsRootPath}${GetAllConfigsBasePath}`;

export type GetAllConfigsQuery = {
	carId?: string[];
};

export type GetAllConfigsResponse = {
	configs: {
		id: string,
		title: string,
		softDeleted?: boolean,
		bundles: {
			bundle: {
				id: string,
				name: string
			}
		}[],
		carId: string,
		createdAt: Date,
		updatedAt: Date,
	}[]
};
