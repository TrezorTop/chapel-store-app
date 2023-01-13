import { Role } from "@prisma/client";
import cuid from "cuid";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { CreateBundles_WrongConfigId, UpdateBundles_NotFound } from "../../../../shared/consts/error";
import {
	UpdateBundlesBasePath,
	UpdateBundlesParams,
	UpdateBundlesRequest,
	UpdateBundlesRequestValidator,
	UpdateBundlesResponse
} from "../../../../shared/endpoints/bundles/updateBundles";
import { Validator } from "../../../../shared/types";
import { ApplicationError } from "../../infrastructure/applicationErrorHandler";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";


const paramsValidator: Validator<UpdateBundlesParams> = {
	id: {
		check: [value => cuid.isCuid(value) || "Невалидный id"],
		required: true
	}
};

export const update = async (instance: FastifyInstance) => {
	instance.put<{
		Reply: UpdateBundlesResponse,
		Body: UpdateBundlesRequest,
		Params: UpdateBundlesParams
	}>(UpdateBundlesBasePath, {
		onRequest: [jwtOnRequestHook({ requiredRole: Role.ADMIN })],
		preValidation: [validatePreValidationHook({ body: UpdateBundlesRequestValidator, params: paramsValidator })]
	}, async (request, reply) => {
		const body = request.body;
		const params = request.params;

		await cancelIfFailed(() => prisma.bundle.findUnique({
				where: {
					id: params.id
				}
			}), StatusCodes.NOT_FOUND, UpdateBundles_NotFound
		);

		if (body.configs) {
			const count = await prisma.config.count({
				where: {
					id: {
						in: body.configs
					}
				}
			});
			if (count !== body.configs.length)
				throw new ApplicationError(StatusCodes.NOT_FOUND, CreateBundles_WrongConfigId);
		}

		const updated = await prisma.bundle.update({
			where: {
				id: params.id
			},
			data: {
				name: body.name,
				configs: {
					deleteMany: { bundleId: params.id },
					...(body?.configs?.length && {
						createMany: {
							data: body.configs.map(id => ({ configId: id }))
						}
					})
				}
			},
			select: {
				id: true,
				name: true,
				price: true
			}
		});

		return reply.status(StatusCodes.OK).send({
			bundle: updated
		});
	});
};
