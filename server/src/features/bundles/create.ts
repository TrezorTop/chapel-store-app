import { Role } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { CreateBundles_WrongConfigId } from "../../../../shared/consts/error";
import {
	CreateBundlesBasePath,
	CreateBundlesRequest,
	CreateBundlesRequestValidator,
	CreateBundlesResponse
} from "../../../../shared/endpoints/bundles/createBundles";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";
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

		await cancelIfFailed(() => prisma.config.findMany({
				where: {
					id: {
						in: body.configs
					}
				}
			}), StatusCodes.NOT_FOUND, CreateBundles_WrongConfigId
		);

		const created = await prisma.bundle.create({
			data: {
				name: body.name,
				price: body.price,
				type: body.type,
				configs: {
					createMany: {
						data: body.configs.map(id => ({ configId: id }))
					}
				}
			},
			select: {
				id: true,
				name: true,
				price: true
			}
		});

		return reply.status(StatusCodes.CREATED).send({
			bundle: created
		});
	});
};
