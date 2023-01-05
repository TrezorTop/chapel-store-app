import cuid from "cuid";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { GetByIdCars_NotFound } from "../../../../shared/consts/error";
import {
	GetByIdCarsBasePath,
	GetByIdCarsParams,
	GetByIdCarsResponse
} from "../../../../shared/endpoints/cars/getByIdCars";
import { Validator } from "../../../../shared/types";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";


const paramsValidator: Validator<GetByIdCarsParams> = {
	id: {
		check: [value => cuid.isCuid(value) || "Невалидный id"],
		required: true
	}
};


export const getById = async (instance: FastifyInstance) => {
	instance.get<{
		Reply: GetByIdCarsResponse,
		Params: GetByIdCarsParams
	}>(GetByIdCarsBasePath, {
		preValidation: [validatePreValidationHook({ params: paramsValidator })]
	}, async (request, reply) => {
		const params = request.params;

		const car = await cancelIfFailed(async () => await prisma.car.findUnique({
			where: {
				id: params.id
			}
		}), StatusCodes.NOT_FOUND, GetByIdCars_NotFound);

		return reply.status(StatusCodes.OK).send({
			car: car
		});
	});
};
