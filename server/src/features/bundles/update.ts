import cuid from "cuid";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import {
	UpdateBundlesBasePath,
	UpdateBundlesParams,
	UpdateBundlesRequest,
	UpdateBundlesRequestValidator,
	UpdateBundlesResponse
} from "../../../../shared/endpoints/bundles/updateBundles";
import { Validator } from "../../../../shared/types";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";


const paramsValidator: Validator<UpdateBundlesParams> = {
	id: [
		value => cuid.isCuid(value) || "Невалидный id"
	]
};

export const update = async (instance: FastifyInstance) => {
	instance.put<{
		Reply: UpdateBundlesResponse,
		Body: UpdateBundlesRequest,
		Params: UpdateBundlesParams
	}>(UpdateBundlesBasePath, {
		onRequest: [jwtOnRequestHook],
		preValidation: [validatePreValidationHook({ body: UpdateBundlesRequestValidator, params: paramsValidator })]
	}, async (request, reply) => {
		const body = request.body;
		const params = request.params;

		const updated = await prisma.bundle.update({
			where: {
				id: params.id
			},
			data: {
				name: body.name
			}
		});

		return reply.status(StatusCodes.OK).send({
			bundle: updated
		});
	});
};
