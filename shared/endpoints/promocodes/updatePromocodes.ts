import { Decimal } from "../../../server/src/infrastructure/prismaConnect";
import { BasePath, PromocodesRootPath } from "../../index";
import { Validator } from "../../types";
import { UpdateBundlesRequest } from "../bundles/updateBundles";


export const UpdatePromocodesBasePath = "/:name";

export const UpdatePromocodesPath = `${BasePath}${PromocodesRootPath}${UpdatePromocodesBasePath}`;

export const UpdatePromocodesRequestValidator: Validator<UpdateBundlesRequest> = {
	softDeleted: {
		check: [],
		required: false
	}
};

export type UpdatePromocodesParams = {
	name: string
}

export type UpdatePromocodesRequest = {
	discountToUser?: number,
	earnedStreamer?: number,
	softDeleted?: boolean
};

export type UpdatePromocodesResponse = {
	promocode: {
		name: string,
		softDeleted: boolean,
		discountToUser: Decimal,
		earnedStreamer: Decimal,
	}
};
