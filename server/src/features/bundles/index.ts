import { FastifyPluginAsync } from "fastify/types/plugin";
import { StatusCodes } from "http-status-codes";
import { GetAllBundlesBasePath, GetAllBundlesResponse } from "../../../../shared/endpoints/bundles/getAll";
import { prisma } from "../../infrastructure/prismaConnect";


const module: FastifyPluginAsync = async (instance) => {
	instance.get<{
		Reply: GetAllBundlesResponse
	}>(GetAllBundlesBasePath, async (request, reply) => {
		const bundles = await prisma.bundle.findMany({
			select: {
				id: true,
				name: true
			}
		});

		return reply.status(StatusCodes.OK).send({ bundles: bundles });
	});
};

export default module;