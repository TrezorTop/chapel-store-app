import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { GetMyBundlesBasePath, GetMyBundlesResponse } from "../../../../shared/endpoints/me/getMyConfigs";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";


export const getMyBundles = async (instance: FastifyInstance) => {
	instance.get<{
		Reply: GetMyBundlesResponse
	}>(GetMyBundlesBasePath, {
		onRequest: [jwtOnRequestHook()]
	}, async (request, reply) => {
		const bundles = await prisma.bundle.findMany({
			where: {
				purchases: {
					some: {
						ownerUsername: request.user.username
					}
				}
			},
			select: {
				id: true,
				name: true,
				price: true,
				configs: {
					select: {
						config: {
							select: {
								id: true,
								title: true
							}
						}
					}
				}
			},
		});

		return reply.status(StatusCodes.OK).send({ bundles: bundles });
	});
};
