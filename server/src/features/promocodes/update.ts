import { Role } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { UpdatePromocodes_NotFound } from "../../../../shared/consts/error";
import {
	UpdatePromocodesBasePath,
	UpdatePromocodesParams,
	UpdatePromocodesRequest,
	UpdatePromocodesRequestValidator,
	UpdatePromocodesResponse
} from "../../../../shared/endpoints/promocodes/updatePromocodes";
import { Validator } from "../../../../shared/types";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";


const paramsValidator: Validator<UpdatePromocodesParams> = {
	name: {
		check: [],
		required: true
	}
};


export const update = async (instance: FastifyInstance) => {
	instance.put<{
		Body: UpdatePromocodesRequest
		Reply: UpdatePromocodesResponse
		Params: UpdatePromocodesParams
	}>(UpdatePromocodesBasePath, {
		onRequest: [jwtOnRequestHook({ requiredRole: Role.ADMIN })],
		preValidation: [validatePreValidationHook({
			body: UpdatePromocodesRequestValidator,
			params: paramsValidator
		})]
	}, async (request, reply) => {
		const params = request.params;
		const body = request.body;

		await cancelIfFailed(() => prisma.promocode.findUnique({
			where: {
				name: params.name
			}
		}), StatusCodes.NOT_FOUND, UpdatePromocodes_NotFound);

		const promocode = await prisma.promocode.update({
			where: {
				name: params.name
			},
			data: {
				discountToUser: body.discountToUser,
				earnedStreamer: body.earnedStreamer,
				softDeleted: body.softDeleted
			},
			select: {
				name: true,
				softDeleted: true,
				discountToUser: true,
				earnedStreamer: true
			}
		});

		return reply.status(StatusCodes.OK).send({ promocode: promocode });
	});
};