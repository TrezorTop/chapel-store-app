import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { GetAllBundlesBasePath, GetAllBundlesResponse } from "../../../../shared/endpoints/bundles/getAllBundles";
import { optionalJwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";


export const getAll = async (instance: FastifyInstance) => {
	instance.get<{
		Reply: GetAllBundlesResponse
	}>(GetAllBundlesBasePath, {
		onRequest: [optionalJwtOnRequestHook()]
	}, async (request, reply) => {
		const isAdmin = request?.user?.role === "ADMIN";

		const bundles = await prisma.bundle.findMany({
			where: {
				...(!isAdmin && { softDeleted: false }),
			},
			select: {
				id: true,
				name: true,
				softDeleted: isAdmin,
				price: true,
				createdAt: true,
				updatedAt: true,
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