import { Role } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import {
	CreateBundlesBasePath,
	CreateBundlesRequest,
	CreateBundlesRequestValidator,
	CreateBundlesResponse
} from "../../../../shared/endpoints/bundles/createBundles";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";


export const create = async (instance: FastifyInstance) => {
	instance.post<{
		Reply: CreateBundlesResponse,
		Body: CreateBundlesRequest
	}>(CreateBundlesBasePath, {
		onRequest: [jwtOnRequestHook({ requiredRole: Role.ADMIN })],
		preValidation: [validatePreValidationHook({ body: CreateBundlesRequestValidator })]
	}, async (request, reply) => {
		const body = request.body;

		const created = await prisma.bundle.create({
			data: {
				name: body.name
			}
		});

		return reply.status(StatusCodes.CREATED).send({
			bundle: created
		});
	});
};
