import { FastifyPluginAsync } from "fastify/types/plugin";
import { StatusCodes } from "http-status-codes";
import { GetAllCarsBasePath, GetAllCarsResponse } from "../../../../shared/endpoints/cars/getAll";
import { prisma } from "../../infrastructure/prismaConnect";


const module: FastifyPluginAsync = async (instance) => {
	instance.get<{
		Reply: GetAllCarsResponse
	}>(GetAllCarsBasePath, async (request, reply) => {
		const cars = await prisma.car.findMany({
			select: {
				id: true,
				name: true
			}
		});

		return reply.status(StatusCodes.OK).send({ cars: cars });
	});
};

export default module;