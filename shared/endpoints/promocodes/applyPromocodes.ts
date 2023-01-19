import { Decimal } from "../../../server/src/infrastructure/prismaConnect";
import { BasePath, PromocodesRootPath } from "../../index";


export const AppllyPromocodesBasePath = "/apply/:name";

export const AppllyPromocodesPath = `${BasePath}${PromocodesRootPath}${AppllyPromocodesBasePath}`;

export type AppllyPromocodesParams = {
	name: string
}

export type AppllyPromocodesQuery = {
	bundleId: string;
};

export type AppllyPromocodesResponse = {
	price: Decimal
};
