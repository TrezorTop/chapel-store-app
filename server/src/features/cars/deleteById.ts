import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { DeleteByIdCarsBasePath, DeleteByIdCarsResponse } from "../../../../shared/endpoints/cars/deleteByIdCars";
import { jwtMiddleware } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";


export const deleteById = async (instance: FastifyInstance) => {
	instance.delete<{
		Params: { id: string }
		Reply: DeleteByIdCarsResponse
	}>(DeleteByIdCarsBasePath, {
		onRequest: [jwtMiddleware]
	}, async (request, reply) => {
		const carId = request.params.id;

		const configs = await getConfigsByCarId(carId);
		if (configs.length > 0)
			return reply.status(StatusCodes.OK).send({ configs: configs });

		const deleted = await prisma.car.deleteMany({
			where: {
				id: carId,
				configs: {
					none: {}
				}
			}
		});
		if (deleted.count === 0)
			return reply.status(StatusCodes.OK).send({ configs: await getConfigsByCarId(carId) });

		return reply.status(StatusCodes.OK).send();
	});
};


const getConfigsByCarId = async (id: string) => await prisma.config.findMany({
	where: {
		carId: id
	},
	select: {
		id: true,
		title: true
	}
});