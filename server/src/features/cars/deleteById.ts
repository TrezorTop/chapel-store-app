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
		const id = request.params.id;

		const configs = await prisma.config.findMany({
			where: {
				carId: id
			},
			select: {
				id: true,
				title: true
			}
		});
		if (configs.length > 0)
			return reply.status(StatusCodes.OK).send({ configs: configs });

		const deleted = await prisma.car.deleteMany({
			where: {
				AND: {
					id: id,
					configs: {
						none: {}
					}
				}
			}
		});
		if (deleted.count === 0)
			return reply.status(StatusCodes.OK).send({ configs: configs });

		return reply.status(StatusCodes.OK).send();
	});
};