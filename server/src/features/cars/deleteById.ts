import cuid from "cuid";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { DeleteByIdCars_NotFound } from "../../../../shared/consts/error";
import {
	DeleteByIdCarsBasePath,
	DeleteByIdCarsParams,
	DeleteByIdCarsResponse
} from "../../../../shared/endpoints/cars/deleteByIdCars";
import { Validator } from "../../../../shared/types";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";


const paramsValidator: Validator<DeleteByIdCarsParams> = {
	id: {
		check: [value => cuid.isCuid(value) || "Невалидный id"],
		required: true
	}
};

export const deleteById = async (instance: FastifyInstance) => {
	instance.delete<{
		Params: DeleteByIdCarsParams
		Reply: DeleteByIdCarsResponse
	}>(DeleteByIdCarsBasePath, {
		onRequest: [jwtOnRequestHook],
		preValidation: [validatePreValidationHook({ params: paramsValidator })]
	}, async (request, reply) => {
		const params = request.params;

		await cancelIfFailed(() => prisma.car.findUnique({
				where: {
					id: params.id
				}
			}), StatusCodes.NOT_FOUND, DeleteByIdCars_NotFound
		);

		const configs = await getConfigsByCarId(params.id);
		if (configs.length > 0)
			return reply.status(StatusCodes.BAD_REQUEST).send({ configs: configs });

		const deleted = await prisma.car.deleteMany({
			where: {
				id: params.id,
				configs: {
					none: {}
				}
			}
		});
		if (deleted.count === 0)
			return reply.status(StatusCodes.BAD_REQUEST).send({ configs: await getConfigsByCarId(params.id) });

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