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
import { optionalJwtOnRequestHook } from "../../infrastructure/jwtConfig";
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
		preValidation: [validatePreValidationHook({ params: paramsValidator })],
		onRequest: [optionalJwtOnRequestHook()]
	}, async (request, reply) => {
		const params = request.params;
		const isAdmin = request?.user?.role === "ADMIN";

		const bundle = await cancelIfFailed(() => prisma.bundle.findUnique({
			where: {
				id: params.id,
				...(!isAdmin && { softDeleted: false }),
			},
			select: {
				id: true,
				name: true,
				softDeleted: isAdmin,
				price: true,
				createdAt: true,
				updatedAt: true,
				configs: {
					select: {
						config: {
							select: {
								id: true,
								title: true
							}
						}
					}
				}
			},
		}), StatusCodes.NOT_FOUND, GetByIdBundles_NotFound);

		return reply.status(StatusCodes.OK).send({
			bundle: bundle
		});
	});
};
