import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { CreateConfigs_WrongBundleId, CreateConfigs_WrongCarId } from "../../../../shared/consts/error";
import {
	CreateConfigsBasePath,
	CreateConfigsRequest,
	CreateConfigsRequestValidator,
	CreateConfigsResponse
} from "../../../../shared/endpoints/configs/createConfigs";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";


export const create = async (instance: FastifyInstance) => {
	instance.post<{
		Reply: CreateConfigsResponse,
		Body: CreateConfigsRequest
	}>(CreateConfigsBasePath, {
		onRequest: [jwtOnRequestHook],
		preValidation: [validatePreValidationHook({ body: CreateConfigsRequestValidator })]
	}, async (request, reply) => {
		const body = request.body;

		await cancelIfFailed(() =>
			prisma.bundle.findUnique({
				where: {
					id: body.bundleId
				}
			}), StatusCodes.NOT_FOUND, CreateConfigs_WrongBundleId
		);
		await cancelIfFailed(() =>
			prisma.car.findUnique({
				where: {
					id: body.carId
				}
			}), StatusCodes.NOT_FOUND, CreateConfigs_WrongCarId
		);

		const created = await prisma.config.create({
			data: {
				title: body.title,
				data: body.data,
				bundleId: body.bundleId,
				carId: body.carId
			}
		});

		return reply.status(StatusCodes.CREATED).send({
			config: created
		});
	});
};
