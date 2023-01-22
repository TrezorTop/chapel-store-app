import { Decimal } from "../../../server/src/infrastructure/prismaConnect";
import { BasePath, MeRootPath } from "../../index";


export const GetMyBundlesBasePath = "/bundles";

export const GetMyBundlesPath = `${BasePath}${MeRootPath}${GetMyBundlesBasePath}`;

export type GetMyBundlesQuery = {
	carId?: string
};

export type GetMyBundlesResponse = {
	bundles: {
		id: string;
		name: string;
		price: Decimal;
		configs: {
			config: {
				id: string;
				title: string;
			};
		}[];
	}[];
};