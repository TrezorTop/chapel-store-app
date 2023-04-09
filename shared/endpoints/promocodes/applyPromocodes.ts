import { Decimal } from "../../../server/src/infrastructure/prismaConnect";
import { BasePath, PromocodesRootPath } from "../../index";


export const ApplyPromocodesBasePath = "/apply/:name";

export const ApplyPromocodesPath = `${BasePath}${PromocodesRootPath}${ApplyPromocodesBasePath}`;

export type ApplyPromocodesParams = {
	name: string
}

export type ApplyPromocodesQuery = {
	bundleId: string;
};

export type ApplyPromocodesResponse = {
	price: Decimal
};
