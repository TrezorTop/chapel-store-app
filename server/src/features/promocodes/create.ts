import { Role } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import {
	CreatePromocodesBasePath,
	CreatePromocodesRequest,
	CreatePromocodesRequestValidator,
	CreatePromocodesResponse
} from "../../../../shared/endpoints/promocodes/createPromocodes";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";


export const create = async (instance: FastifyInstance) => {
	instance.post<{
		Reply: CreatePromocodesResponse,
		Body: CreatePromocodesRequest
	}>(CreatePromocodesBasePath, {
		onRequest: [jwtOnRequestHook({ requiredRole: Role.ADMIN })],
		preValidation: [validatePreValidationHook({ body: CreatePromocodesRequestValidator })]
	}, async (request, reply) => {
		const body = request.body;

		const created = await prisma.promocode.create({
			data: {
				name: body.name,
				discountToUser: body.discountToUser,
				earnedStreamer: body.earnedStreamer
			}
		});

		return reply.status(StatusCodes.CREATED).send({
			promocode: created
		});
	});
};
