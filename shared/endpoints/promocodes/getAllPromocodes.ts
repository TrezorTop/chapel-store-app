import { Decimal } from "../../../server/src/infrastructure/prismaConnect";
import { BasePath, PromocodesRootPath } from "../../index";


export const GetAllPromocodesBasePath = "";

export const GetAllPromocodesPath = `${BasePath}${PromocodesRootPath}${GetAllPromocodesBasePath}`;

export type GetAllPromocodesResponse = {
	promocodes: {
		name: string,
		softDeleted: boolean,
		discountToUser: Decimal,
		earnedStreamer: Decimal,
	}[]
};
