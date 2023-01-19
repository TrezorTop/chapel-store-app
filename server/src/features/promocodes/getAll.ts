import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import {
	GetAllPromocodesBasePath,
	GetAllPromocodesResponse
} from "../../../../shared/endpoints/promocodes/getAllPromocodes";
import { optionalJwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";


export const getAll = async (instance: FastifyInstance) => {
	instance.get<{
		Reply: GetAllPromocodesResponse,
	}>(GetAllPromocodesBasePath, {
		onRequest: [optionalJwtOnRequestHook()]
	}, async (request, reply) => {
		const isAdmin = request?.user?.role === "ADMIN";

		const promocodes = await prisma.promocode.findMany({
			where: {
				...(!isAdmin && { softDeleted: false }),
			},
			select: {
				name: true,
				softDeleted: true,
				discountToUser: true,
				earnedStreamer: true
			}
		});

		return reply.status(StatusCodes.OK).send({ promocodes: promocodes });
	});
};