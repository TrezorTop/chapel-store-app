import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import {
	GetMyBundlesBasePath,
	GetMyBundlesQuery,
	GetMyBundlesResponse
} from "../../../../shared/endpoints/me/getMyBundles";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";


export const getMyBundles = async (instance: FastifyInstance) => {
	instance.get<{
		Reply: GetMyBundlesResponse
		Querystring: GetMyBundlesQuery
	}>(GetMyBundlesBasePath, {
		onRequest: [jwtOnRequestHook()]
	}, async (request, reply) => {
		const query = request.query;

		const bundles = await prisma.bundle.findMany({
			where: {
				...(query.carId && {
					configs: {
						some: {
							config: {
								carId: query.carId,
							}
						}
					}
				}),
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
			orderBy: {
				configs: {
					_count: "desc"
				}
			}
		});

		return reply.status(StatusCodes.OK).send({ bundles: bundles });
	});
};
