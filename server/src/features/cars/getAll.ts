import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { GetAllCarsBasePath, GetAllCarsResponse } from "../../../../shared/endpoints/cars/getAllCars";
import { prisma } from "../../infrastructure/prismaConnect";


export const getAll = async (instance: FastifyInstance) => {
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
