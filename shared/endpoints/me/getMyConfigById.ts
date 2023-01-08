import { JsonValue } from "../../../server/src/infrastructure/prismaConnect";
import { BasePath, MeRootPath } from "../../index";


export const GetMyConfigByIdBasePath = "/configs/:id";

export const GetMyConfigByIdPath = `${BasePath}${MeRootPath}${GetMyConfigByIdBasePath}`;

export type GetByIdConfigsParams = {
	id: string
}

export type GetMyConfigByIdResponse = {
	config: {
		id: string,
		title: string,
		data: JsonValue
	}
};