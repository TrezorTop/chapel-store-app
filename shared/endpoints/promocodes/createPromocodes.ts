import { Decimal } from "../../../server/src/infrastructure/prismaConnect";
import { BasePath, PromocodesRootPath } from "../../index";
import { Validator } from "../../types";


export const CreatePromocodesBasePath = "";

export const CreatePromocodesPath = `${BasePath}${PromocodesRootPath}${CreatePromocodesBasePath}`;

export const CreatePromocodesRequestValidator: Validator<CreatePromocodesRequest> = {
	name: {
		check: [
			value => value.length >= 1 || "Минимальная длина 1 символ",
			value => value.length <= 128 || "Максимальная длина 128 символа"
		],
		required: true
	},
	discountToUser: {
		check: [],
		required: true
	},
	earnedStreamer: {
		check: [],
		required: true
	},
};

export type CreatePromocodesRequest = {
	name: string,
	discountToUser: number,
	earnedStreamer: number,
}

export type CreatePromocodesResponse = {
	promocode: {
		name: string,
		discountToUser: Decimal,
		earnedStreamer: Decimal,
	}
};
