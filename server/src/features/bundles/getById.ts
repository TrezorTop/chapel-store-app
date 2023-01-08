import cuid from "cuid";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { GetByIdBundles_NotFound } from "../../../../shared/consts/error";
import {
	GetByIdBundlesBasePath,
	GetByIdBundlesParams,
	GetByIdBundlesResponse
} from "../../../../shared/endpoints/bundles/getByIdBundles";
import { Validator } from "../../../../shared/types";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";


const paramsValidator: Validator<GetByIdBundlesParams> = {
	id: {
		check: [value => cuid.isCuid(value) || "Невалидный id"],
		required: true
	}
};

export const getById = async (instance: FastifyInstance) => {
	instance.get<{
		Reply: GetByIdBundlesResponse,
		Params: GetByIdBundlesParams
	}>(GetByIdBundlesBasePath, {
		preValidation: [validatePreValidationHook({ params: paramsValidator })]
	}, async (request, reply) => {
		const params = request.params;

		const bundle = await cancelIfFailed(async () => await prisma.bundle.findUnique({
			where: {
				id: params.id
			},
			include: {
				configs: {
					select: {
						id: true,
						title: true
					}
				}
			}
		}), StatusCodes.NOT_FOUND, GetByIdBundles_NotFound);

		return reply.status(StatusCodes.OK).send({
			bundle: bundle
		});
	});
};
