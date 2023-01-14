import { Role } from "@prisma/client";
import cuid from "cuid";
import { FastifyInstance } from "fastify";
import fs from "fs/promises";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { DeleteConfigs_BundlesRelationNotEmpty, DeleteConfigs_NotFound } from "../../../../shared/consts/error";
import {
	DeleteByIdConfigsBasePath,
	DeleteByIdConfigsParams,
	DeleteByIdConfigsResponse
} from "../../../../shared/endpoints/configs/deleteByIdConfigs";
import { Validator } from "../../../../shared/types";
import { configsPath } from "../../constants";
import { ApplicationError } from "../../infrastructure/applicationErrorHandler";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";


const paramsValidator: Validator<DeleteByIdConfigsParams> = {
	id: {
		check: [value => cuid.isCuid(value) || "Невалидный id"],
		required: true
	}
};

export const deleteById = async (instance: FastifyInstance) => {
	instance.delete<{
		Reply: DeleteByIdConfigsResponse,
		Params: DeleteByIdConfigsParams
	}>(DeleteByIdConfigsBasePath, {
		onRequest: [jwtOnRequestHook({ requiredRole: Role.ADMIN })],
		preValidation: [validatePreValidationHook({ params: paramsValidator })]
	}, async (request, reply) => {
		const params = request.params;

		const config = await cancelIfFailed(() => prisma.config.findUnique({
				where: {
					id: params.id
				},
				select: {
					_count: {
						select: {
							bundles: true
						}
					}
				}
			}), StatusCodes.NOT_FOUND, DeleteConfigs_NotFound
		);

		if (config._count.bundles > 0)
			throw new ApplicationError(StatusCodes.FORBIDDEN, DeleteConfigs_BundlesRelationNotEmpty);

		await prisma.config.delete({
			where: {
				id: params.id
			}
		});
		const configPath = path.join(configsPath, params.id);
		await fs.rm(configPath, { recursive: true, force: true });

		return reply.status(StatusCodes.OK).send();
	});
};
