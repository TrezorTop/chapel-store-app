import { BasePath, PaymentsRootPath } from "../../index";


export const GetUserConfigsBasePath = "";

export const GetUserConfigsPath = `${BasePath}${PaymentsRootPath}${GetUserConfigsBasePath}`;

export type GetUserConfigsResponse = {
	configs: {
		id: string,
		title: string,
		data: string
	}[]
};