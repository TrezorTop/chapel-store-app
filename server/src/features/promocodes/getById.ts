import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { GetByIdPromocodes_NotFound } from "../../../../shared/consts/error";
import {
	GetByIdPromocodesBasePath,
	GetByIdPromocodesParams,
	GetByIdPromocodesResponse
} from "../../../../shared/endpoints/promocodes/getByIdPromocodes";
import { Validator } from "../../../../shared/types";
import { optionalJwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";


const paramsValidator: Validator<GetByIdPromocodesParams> = {
	name: {
		check: [],
		required: true
	}
};
export const getById = async (instance: FastifyInstance) => {
	instance.get<{
		Reply: GetByIdPromocodesResponse,
		Params: GetByIdPromocodesParams
	}>(GetByIdPromocodesBasePath, {
		preValidation: [validatePreValidationHook({ params: paramsValidator })],
		onRequest: [optionalJwtOnRequestHook()]
	}, async (request, reply) => {
		const params = request.params;
		const isAdmin = request?.user?.role === "ADMIN";

		const promocode = await cancelIfFailed(() => prisma.promocode.findFirst({
			where: {
				name: params.name,
				...(!isAdmin && { softDeleted: false }),
			},
			select: {
				name: true,
				softDeleted: true,
				discountToUser: true,
				earnedStreamer: true,
				...(!isAdmin && {
					promocodeStatistics: {
						select: {
							id: true,
							payToStreamer: true,
							savedToUser: true
						}
					}
				})
			},
		}), StatusCodes.NOT_FOUND, GetByIdPromocodes_NotFound);

		return reply.status(StatusCodes.OK).send({
			promocode: promocode
		});
	});
};
