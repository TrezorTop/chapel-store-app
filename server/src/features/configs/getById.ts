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
		preValidation: [validatePreValidationHook({ params: paramsValidator })]
	}, async (request, reply) => {
		const params = request.params;

		const config = await cancelIfFailed(async () => await prisma.config.findFirst({
			where: {
				id: params.id,
				softDeleted: false
			},
			select: {
				id: true,
				title: true,
				data: true
			}
		}), StatusCodes.NOT_FOUND, GetByIdConfigs_NotFound);

		return reply.status(StatusCodes.OK).send({
			config: config
		});
	});
};