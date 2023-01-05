import cuid from "cuid";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { UpdateConfigs_NotFound } from "../../../../shared/consts/error";
import {
	UpdateConfigsBasePath,
	UpdateConfigsParams,
	UpdateConfigsRequest,
	UpdateConfigsRequestValidator,
	UpdateConfigsResponse
} from "../../../../shared/endpoints/configs/updateConfigs";
import { Validator } from "../../../../shared/types";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";


const paramsValidator: Validator<UpdateConfigsParams> = {
	id: {
		check: [value => cuid.isCuid(value) || "Невалидный id"],
		required: true
	}
};

export const update = async (instance: FastifyInstance) => {
	instance.put<{
		Reply: UpdateConfigsResponse,
		Body: UpdateConfigsRequest,
		Params: UpdateConfigsParams
	}>(UpdateConfigsBasePath, {
		onRequest: [jwtOnRequestHook],
		preValidation: [validatePreValidationHook({ body: UpdateConfigsRequestValidator, params: paramsValidator })]
	}, async (request, reply) => {
		const body = request.body;
		const params = request.params;

		await cancelIfFailed(() => prisma.config.findUnique({
				where: {
					id: params.id
				}
			}), StatusCodes.NOT_FOUND, UpdateConfigs_NotFound
		);

		const updated = await prisma.config.update({
			where: {
				id: params.id
			},
			data: {
				title: body.title,
				data: body.data,
				carId: body.carId,
				bundleId: body.bundleId
			}
		});

		return reply.status(StatusCodes.OK).send({
			config: updated
		});
	});
};
