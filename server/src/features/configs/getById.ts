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
		Params: GetByIdConfigsParams,
		Reply: GetByIdConfigsResponse
	}>(GetByIdConfigsBasePath, {
		preValidation: [validatePreValidationHook({ params: paramsValidator })]
	}, async (request, reply) => {
		const params = request.params;

		const config = await cancelIfFailed(async () => await prisma.config.findFirst({
			where: {
				id: params.id,
			},
			select: {
				id: true,
				title: true,
				bundles: {
					select: {
						bundleId: true
					}
				},
				carId: true,
				createdAt: true,
				updatedAt: true,
				files: {
					select: {
						name: true,
						originalName: true,
						size: true
					}
				}
			}
		}), StatusCodes.NOT_FOUND, GetByIdConfigs_NotFound);

		return reply.status(StatusCodes.OK).send({
			config: config
		});
	});
};