import { Decimal } from "../../../server/src/infrastructure/prismaConnect";
import { BasePath, PromocodesRootPath } from "../../index";


export const GetByIdPromocodesBasePath = "/:name";

export const GetByIdPromocodesPath = `${BasePath}${PromocodesRootPath}${GetByIdPromocodesBasePath}`;

export type GetByIdPromocodesParams = {
	name: string
}

export type GetByIdPromocodesResponse = {
	promocode: {
		name: string,
		softDeleted: boolean,
		discountToUser: Decimal,
		earnedStreamer: Decimal,
		promocodeStatistics?: {
			id: string,
			payToStreamer: Decimal
			savedToUser: Decimal
		}[]
	}
};