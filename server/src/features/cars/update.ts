import cuid from "cuid";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { UpdateCars_NotFound } from "../../../../shared/consts/error";
import {
	UpdateCarsBasePath,
	UpdateCarsParams,
	UpdateCarsRequest,
	UpdateCarsRequestValidator,
	UpdateCarsResponse
} from "../../../../shared/endpoints/cars/updateCars";
import { Validator } from "../../../../shared/types";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";


const paramsValidator: Validator<UpdateCarsParams> = {
	id: {
		check: [value => cuid.isCuid(value) || "Невалидный id"],
		required: true
	}
};

export const update = async (instance: FastifyInstance) => {
	instance.put<{
		Reply: UpdateCarsResponse,
		Body: UpdateCarsRequest,
		Params: UpdateCarsParams
	}>(UpdateCarsBasePath, {
		onRequest: [jwtOnRequestHook],
		preValidation: [validatePreValidationHook({ body: UpdateCarsRequestValidator, params: paramsValidator })]
	}, async (request, reply) => {
		const body = request.body;
		const params = request.params;

		await cancelIfFailed(() => prisma.car.findUnique({
				where: {
					id: params.id
				}
			}), StatusCodes.NOT_FOUND, UpdateCars_NotFound
		);

		const updated = await prisma.car.update({
			where: {
				id: params.id
			},
			data: {
				name: body.name
			}
		});

		return reply.status(StatusCodes.OK).send({
			car: updated
		});
	});
};
