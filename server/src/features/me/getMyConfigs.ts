import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { GetMyConfigsBasePath, GetMyConfigsResponse } from "../../../../shared/endpoints/me/getMyConfigs";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";


export const getMyConfigs = async (instance: FastifyInstance) => {
	instance.get<{
		Reply: GetMyConfigsResponse
	}>(GetMyConfigsBasePath, {
		onRequest: [jwtOnRequestHook]
	}, async (request, reply) => {
		const configs = await prisma.config.findMany({
			where: {
				purchases: {
					some: {
						ownerUsername: request.user.username
					}
				}
			},
			select: {
				id: true,
				title: true
			}
		});

		return reply.status(StatusCodes.OK).send({ configs: configs });
	});
};
