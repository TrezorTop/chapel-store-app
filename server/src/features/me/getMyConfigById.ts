import cuid from "cuid";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { GetMyConfigById_NotFound } from "../../../../shared/consts/error";
import { GetByIdConfigsParams } from "../../../../shared/endpoints/configs/getById";
import { GetMyConfigByIdBasePath, GetMyConfigByIdResponse } from "../../../../shared/endpoints/me/getMyConfigById";
import { Validator } from "../../../../shared/types";
import { optionalJwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";


const paramsValidator: Validator<GetByIdConfigsParams> = {
	id: {
		check: [value => cuid.isCuid(value) || "Невалидный id"],
		required: true
	}
};


export const getMyConfigById = async (instance: FastifyInstance) => {
	instance.get<{
		Reply: GetMyConfigByIdResponse,
		Params: GetByIdConfigsParams
	}>(GetMyConfigByIdBasePath, {
		onRequest: [optionalJwtOnRequestHook],
		preValidation: [validatePreValidationHook({ params: paramsValidator })]
	}, async (request, reply) => {
		const params = request.params;

		const config = await cancelIfFailed(async () => await prisma.config.findFirst({
			where: {
				id: params.id,
				purchases: {
					some: {
						ownerUsername: request.user.username
					}
				}
			},
			select: {
				id: true,
				title: true,
				data: true
			}
		}), StatusCodes.NOT_FOUND, GetMyConfigById_NotFound);

		return reply.status(StatusCodes.OK).send({
			config: config
		});
	});
};