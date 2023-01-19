import { BundleType, Decimal } from "../../../server/src/infrastructure/prismaConnect";
import { BasePath, BundlesRootPath } from "../../index";


export const GetByIdBundlesBasePath = "/:id";

export const GetByIdBundlesPath = `${BasePath}${BundlesRootPath}${GetByIdBundlesBasePath}`;

export type GetByIdBundlesParams = {
	id: string
}

export type GetByIdBundlesResponse = {
	bundle: {
		id: string,
		name: string,
		price: Decimal,
		type: BundleType,
		softDeleted: boolean,
		createdAt: Date,
		updatedAt: Date,
		configs: {
			config: {
				id: string,
				title: string
			}
		}[]
	}
};
