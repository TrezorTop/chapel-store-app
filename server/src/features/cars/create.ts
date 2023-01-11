import { Role } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import {
	CreateCarsBasePath,
	CreateCarsRequest,
	CreateCarsRequestValidator,
	CreateCarsResponse
} from "../../../../shared/endpoints/cars/createCars";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";


export const create = async (instance: FastifyInstance) => {
	instance.post<{
		Reply: CreateCarsResponse,
		Body: CreateCarsRequest
	}>(CreateCarsBasePath, {
		onRequest: [jwtOnRequestHook({ requiredRole: Role.ADMIN })],
		preValidation: [validatePreValidationHook({ body: CreateCarsRequestValidator })]
	}, async (request, reply) => {
		const body = request.body;

		const created = await prisma.car.create({
			data: {
				name: body.name
			}
		});

		return reply.status(StatusCodes.CREATED).send({
			car: created
		});
	});
};
