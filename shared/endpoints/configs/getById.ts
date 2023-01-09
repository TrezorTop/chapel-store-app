import { JsonValue } from "../../../server/src/infrastructure/prismaConnect";
import { BasePath, ConfigsRootPath } from "../../index";


export const GetByIdConfigsBasePath = "/:id";

export const GetByIdConfigsPath = `${BasePath}${ConfigsRootPath}${GetByIdConfigsBasePath}`;

export type GetByIdConfigsParams = {
	id: string
}

export type GetByIdConfigsResponse = {
	config: {
		id: string,
		title: string,
		data?: JsonValue,
		softDeleted?: boolean,
		bundleId: string,
		carId: string
	}
};
