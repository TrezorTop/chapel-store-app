import { Decimal } from "@prisma/client/runtime";
import cuid from "cuid";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { ApplyPromocodes_BundleNotFound, ApplyPromocodes_PromocodeNotFound } from "../../../../shared/consts/error";
import {
	AppllyPromocodesBasePath,
	AppllyPromocodesParams,
	AppllyPromocodesQuery,
	AppllyPromocodesResponse
} from "../../../../shared/endpoints/promocodes/applyPromocodes";
import { Validator } from "../../../../shared/types";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";


const paramsValidator: Validator<AppllyPromocodesParams> = {
	name: {
		check: [],
		required: true
	}
};

const queryValidator: Validator<AppllyPromocodesQuery> = {
	bundleId: {
		check: [value => cuid.isCuid(value) || "Невалидный id"],
		required: true
	}
};

export const apply = async (instance: FastifyInstance) => {
	instance.get<{
		Reply: AppllyPromocodesResponse,
		Querystring: AppllyPromocodesQuery,
		Params: AppllyPromocodesParams
	}>(AppllyPromocodesBasePath, {
		preValidation: [validatePreValidationHook({
			query: queryValidator,
			params: paramsValidator
		})]
	}, async (request, reply) => {
		const params = request.params;
		const query = request.query;

		const bundle = await cancelIfFailed(() => prisma.bundle.findUnique({
				where: {
					id: query.bundleId
				}
			}), StatusCodes.NOT_FOUND, ApplyPromocodes_BundleNotFound
		);
		const promocode = await cancelIfFailed(() => prisma.promocode.findUnique({
				where: {
					name: params.name
				}
			}), StatusCodes.NOT_FOUND, ApplyPromocodes_PromocodeNotFound
		);

		const newPrice = applyDiscount(bundle.price, promocode.discountToUser);

		return reply.status(StatusCodes.OK).send({ price: newPrice });
	});
};


export function applyDiscount(origin: Decimal, discount: Decimal) {
	const coefficient = origin.div(100);
	const leftOver = coefficient.mul(discount);
	const newPrice = origin.minus(leftOver);

	return newPrice;
}