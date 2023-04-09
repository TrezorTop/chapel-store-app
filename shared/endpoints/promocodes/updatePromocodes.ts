import { Decimal } from "../../../server/src/infrastructure/prismaConnect";
import { BasePath, PromocodesRootPath } from "../../index";
import { Validator } from "../../types";
import { makeOptionalValidator } from "../../utils";
import { CreatePromocodesRequestValidator } from "./createPromocodes";


export const UpdatePromocodesBasePath = "/:name";

export const UpdatePromocodesPath = `${BasePath}${PromocodesRootPath}${UpdatePromocodesBasePath}`;

export type UpdatePromocodesParams = {
	name: string
}

export const UpdatePromocodesRequestValidator: Validator<UpdatePromocodesRequest> = {
	...makeOptionalValidator(CreatePromocodesRequestValidator),
	softDeleted: {
		check: [],
		required: false
	}
};

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
