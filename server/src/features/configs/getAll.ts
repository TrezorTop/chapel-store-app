import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import {
	GetAllConfigsBasePath,
	GetAllConfigsQuery,
	GetAllConfigsResponse
} from "../../../../shared/endpoints/configs/getAllConfigs";
import { Validator } from "../../../../shared/types";
import { prisma } from "../../infrastructure/prismaConnect";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";


const queryValidator: Validator<GetAllConfigsQuery> = {
	carName: {
		check: [],
		required: false
	}
};


export const getAll = async (instance: FastifyInstance) => {
	instance.get<{
		Reply: GetAllConfigsResponse,
		Querystring: GetAllConfigsQuery
	}>(GetAllConfigsBasePath, {
		preValidation: [validatePreValidationHook({ query: queryValidator })]
	}, async (request, reply) => {
		const query = request.query;

		const configs = await prisma.config.findMany({
			where: {
				car: {
					...(query.carName && {
						name: {
							in: query.carName
						}
					})
				}
			},
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