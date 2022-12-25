import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import {
	DeleteByIdBundlesBasePath,
	DeleteByIdBundlesResponse
} from "../../../../shared/endpoints/bundles/deleteByIdBundles";
import { jwtMiddleware } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";


export const deleteById = async (instance: FastifyInstance) => {
	instance.delete<{
		Params: { id: string }
		Reply: DeleteByIdBundlesResponse
	}>(DeleteByIdBundlesBasePath, {
		onRequest: [jwtMiddleware]
	}, async (request, reply) => {
		const id = request.params.id;

		const configs = await prisma.config.findMany({
			where: {
				bundleId: id
			},
			select: {
				id: true,
				title: true
			}
		});
		const result = configs.length > 0 ? { configs: configs } : {};

		return reply.status(StatusCodes.OK).send(result);
	});
};