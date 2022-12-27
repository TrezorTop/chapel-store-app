import cuid from "cuid";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import {
	DeleteByIdBundlesBasePath,
	DeleteByIdBundlesParams,
	DeleteByIdBundlesResponse
} from "../../../../shared/endpoints/bundles/deleteByIdBundles";
import { Validator } from "../../../../shared/types";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
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
		onRequest: [jwtOnRequestHook],
		preValidation: [validatePreValidationHook({ params: paramsValidator })]
	}, async (request, reply) => {
		const bundleId = request.params.id;

		const configs = await getConfigsByBundleId(bundleId);
		if (configs.length > 0)
			return reply.status(StatusCodes.BAD_REQUEST).send({ configs: configs });

		const deleted = await prisma.bundle.deleteMany({
			where: {
				AND: {
					id: bundleId,
					configs: {
						none: {}
					}
				}
			}
		});
		if (deleted.count === 0)
			return reply.status(StatusCodes.BAD_REQUEST).send({ configs: await getConfigsByBundleId(bundleId) });

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