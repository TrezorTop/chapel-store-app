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

		const bundle = await prisma.bundle.update({
			where: {
				id: params.id
			},
			data: {
				softDeleted: true
			},
			select: {
				id: true,
				name: true,
				price: true
			}
		});

		return reply.status(StatusCodes.OK).send({ bundle: bundle });
	});
};