import { BasePath, ConfigsRootPath } from "../../index";


export const DeleteByIdConfigsBasePath = "/:id";

export const DeleteByIdConfigsPath = `${BasePath}${ConfigsRootPath}${DeleteByIdConfigsBasePath}`;

export type DeleteByIdConfigsParams = {
	id: string
}

export type DeleteByIdConfigsResponse = {};