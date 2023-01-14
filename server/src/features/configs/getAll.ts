import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { GetAllConfigsBasePath, GetAllConfigsResponse } from "../../../../shared/endpoints/configs/getAllConfigs";
import { prisma } from "../../infrastructure/prismaConnect";


export const getAll = async (instance: FastifyInstance) => {
	instance.get<{
		Reply: GetAllConfigsResponse
	}>(GetAllConfigsBasePath, async (request, reply) => {
		const configs = await prisma.config.findMany({
			select: {
				id: true,
				title: true,
				bundles: {
					select: {
						bundle: {
							select: {
								id: true,
								name: true
							}
						}
					}
				},
				carId: true,
				createdAt: true,
				updatedAt: true
			}
		});

		return reply.status(StatusCodes.OK).send({ configs: configs });
	});
};