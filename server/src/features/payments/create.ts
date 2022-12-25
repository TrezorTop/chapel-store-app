import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import {
	CreatePaymentBasePath,
	CreatePaymentRequest,
	CreatePaymentResponse
} from "../../../../shared/endpoints/payments/createPayment";
import { jwtMiddleware } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";


export const create = async (instance: FastifyInstance) => {
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