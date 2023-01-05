import cuid from "cuid";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { GetByIdConfigs_NotFound } from "../../../../shared/consts/error";
import {
	GetByIdConfigsBasePath,
	GetByIdConfigsParams,
	GetByIdConfigsResponse
} from "../../../../shared/endpoints/configs/getById";
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


export const getById = async (instance: FastifyInstance) => {
	instance.get<{
		Reply: GetByIdConfigsResponse,
		Params: GetByIdConfigsParams
	}>(GetByIdConfigsBasePath, {
		onRequest: [optionalJwtOnRequestHook],
		preValidation: [validatePreValidationHook({ params: paramsValidator })]
	}, async (request, reply) => {
		const params = request.params;

		const config = await cancelIfFailed(async () => await prisma.config.findFirst({
			where: {
				id: params.id,
				...(request?.user?.role !== "ADMIN" && { softDeleted: false })
			},
			select: {
				id: true,
				title: true,
				data: true,
				bundleId: true,
				carId: true
			}
		}), StatusCodes.NOT_FOUND, GetByIdConfigs_NotFound);

		return reply.status(StatusCodes.OK).send({
			config: config
		});
	});
};