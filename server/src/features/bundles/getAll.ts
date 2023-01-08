import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { GetAllBundlesBasePath, GetAllBundlesResponse } from "../../../../shared/endpoints/bundles/getAllBundles";
import { prisma } from "../../infrastructure/prismaConnect";


export const getAll = async (instance: FastifyInstance) => {
	instance.get<{
		Reply: GetAllBundlesResponse
	}>(GetAllBundlesBasePath, async (request, reply) => {
		const bundles = await prisma.bundle.findMany({
			select: {
				id: true,
				name: true,
				configs: {
					select: {
						id: true,
						title: true
					}
				}
			}
		});

		return reply.status(StatusCodes.OK).send({ bundles: bundles });
	});
};