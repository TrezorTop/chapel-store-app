import { FastifyPluginAsync } from "fastify/types/plugin";
import { StatusCodes } from "http-status-codes";
import {
	GetAllConfigBasePath,
	GetAllConfigParams,
	GetAllConfigResponse
} from "../../../../shared/endpoints/configs/getAll";
import { prisma } from "../../infrastructure/prismaConnect";


const module: FastifyPluginAsync = async (instance) => {
	instance.get<{
		Reply: GetAllConfigResponse,
		Params: GetAllConfigParams
	}>(GetAllConfigBasePath, async (request, reply) => {
		const query = request.params;

		const configs = await prisma.config.findMany({
			where: {
				carId: query.carId,
				bundleId: query.bundleId
			},
			select: {
				id: true,
				title: true,
				data: true
			}
		});

		return reply.status(StatusCodes.OK).send({ configs: configs });
	});
};

export default module;