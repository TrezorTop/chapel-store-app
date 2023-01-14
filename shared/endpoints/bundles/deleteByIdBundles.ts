import { Decimal } from "../../../server/src/infrastructure/prismaConnect";
import { BasePath, BundlesRootPath } from "../../index";


export const DeleteByIdBundlesBasePath = "/:id";

export const DeleteByIdBundlesPath = `${BasePath}${BundlesRootPath}${DeleteByIdBundlesBasePath}`;

export type DeleteByIdBundlesParams = { id: string };

export type DeleteByIdBundlesResponse = {
	bundle: {
		id: string,
		name: string,
		price: Decimal
	}
};
