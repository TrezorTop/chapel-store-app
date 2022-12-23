import { FastifyPluginAsync } from "fastify/types/plugin";
import { StatusCodes } from "http-status-codes";
import {
	CreatePaymentBasePath,
	CreatePaymentRequest,
	CreatePaymentResponse
} from "../../../../shared/endpoints/payments/createPayment";
import { GetUserConfigsBasePath, GetUserConfigsResponse } from "../../../../shared/endpoints/payments/getUserConfigs";
import { jwtMiddleware } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";


const module: FastifyPluginAsync = async (instance) => {
	instance.get<{
		Reply: GetUserConfigsResponse
	}>(GetUserConfigsBasePath, {
		onRequest: [jwtMiddleware]
	}, async (request, reply) => {
		const configs = await prisma.config.findMany({
			where: {
				purchases: {
					some: {
						ownerUsername: request.user.username
					}
				}
			},
			select: {
				id: true,
				data: true,
				title: true
			}
		});

		return reply.status(StatusCodes.OK).send({ configs: configs });
	});

	instance.post<{
		Reply: CreatePaymentResponse,
		Body: CreatePaymentRequest
	}>(CreatePaymentBasePath, {
		onRequest: [jwtMiddleware]
	}, async (request, reply) => {
		const body = request.body;

		const purchases = await prisma.purchases.create({
			data: {
				ownerUsername: request.user.username,
				configId: body.configId
			}
		});

		return reply.status(StatusCodes.OK).send({ url: "hueta" });
	});
};

export default module;