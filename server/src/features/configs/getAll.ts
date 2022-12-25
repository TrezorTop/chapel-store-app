import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import {
	GetAllConfigsBasePath,
	GetAllConfigsParams,
	GetAllConfigsResponse
} from "../../../../shared/endpoints/configs/getAllConfigs";
import { prisma } from "../../infrastructure/prismaConnect";


export const getAll = async (instance: FastifyInstance) => {
	instance.get<{
		Reply: GetAllConfigsResponse,
		Params: GetAllConfigsParams
	}>(GetAllConfigsBasePath, async (request, reply) => {
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