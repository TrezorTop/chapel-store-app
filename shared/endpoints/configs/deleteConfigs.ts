import { BasePath, ConfigsRootPath } from "../../index";


export const DeleteConfigsBasePath = "/:id";

export const DeleteConfigsPath = `${BasePath}${ConfigsRootPath}${DeleteConfigsBasePath}`;

export type DeleteConfigsParams = {
	id: string
}

export type DeleteConfigsResponse = {};