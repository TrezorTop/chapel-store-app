import { Role } from "@prisma/client";
import cuid from "cuid";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { DeleteByIdBundles_NotFound } from "../../../../shared/consts/error";
import {
	DeleteByIdBundlesBasePath,
	DeleteByIdBundlesParams,
	DeleteByIdBundlesResponse
} from "../../../../shared/endpoints/bundles/deleteByIdBundles";
import { Validator } from "../../../../shared/types";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";


const paramsValidator: Validator<DeleteByIdBundlesParams> = {
	id: {
		check: [value => cuid.isCuid(value) || "Невалидный id"],
		required: true
	}
};

export const deleteById = async (instance: FastifyInstance) => {
	instance.delete<{
		Params: DeleteByIdBundlesParams
		Reply: DeleteByIdBundlesResponse
	}>(DeleteByIdBundlesBasePath, {
		onRequest: [jwtOnRequestHook({ requiredRole: Role.ADMIN })],
		preValidation: [validatePreValidationHook({ params: paramsValidator })]
	}, async (request, reply) => {
		const params = request.params;

		await cancelIfFailed(() => prisma.bundle.findUnique({
			where: {
				id: params.id
			}
		}), StatusCodes.NOT_FOUND, DeleteByIdBundles_NotFound);

		const configs = await getConfigsByBundleId(params.id);
		if (configs.length > 0)
			return reply.status(StatusCodes.BAD_REQUEST).send({ configs: configs });

		const deleted = await prisma.bundle.deleteMany({
			where: {
				AND: {
					id: params.id,
					configs: {
						none: {}
					}
				}
			}
		});
		if (deleted.count === 0)
			return reply.status(StatusCodes.BAD_REQUEST).send({ configs: await getConfigsByBundleId(params.id) });

		return reply.status(StatusCodes.OK).send();
	});
};


const getConfigsByBundleId = async (id: string) => await prisma.config.findMany({
	where: {
		bundleId: id
	},
	select: {
		id: true,
		title: true
	}
});