import { Role } from "@prisma/client";
import cuid from "cuid";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { DeleteConfigs_NotFound } from "../../../../shared/consts/error";
import {
	DeleteByIdConfigsBasePath,
	DeleteByIdConfigsParams,
	DeleteByIdConfigsResponse
} from "../../../../shared/endpoints/configs/deleteByIdConfigs";
import { Validator } from "../../../../shared/types";
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

		await cancelIfFailed(() => prisma.config.findUnique({
				where: {
					id: params.id
				}
			}), StatusCodes.NOT_FOUND, DeleteConfigs_NotFound
		);

		await prisma.config.update({
			where: {
				id: params.id
			},
			data: {
				softDeleted: true
			}
		});

		return reply.status(StatusCodes.OK).send();
	});
};
