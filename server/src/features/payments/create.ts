import cuid from "cuid";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import {
	CreatePaymentBasePath,
	CreatePaymentRequest,
	CreatePaymentResponse
} from "../../../../shared/endpoints/payments/createPayment";
import { Validator } from "../../../../shared/types";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";


const bodyValidator: Validator<CreatePaymentRequest> = {
	configId: {
		check: [value => cuid.isCuid(value) || "Невалидный id"],
		required: true
	}

};


export const create = async (instance: FastifyInstance) => {
	instance.post<{
		Reply: CreatePaymentResponse,
		Body: CreatePaymentRequest
	}>(CreatePaymentBasePath, {
		onRequest: [jwtOnRequestHook],
		preValidation: [validatePreValidationHook({ body: bodyValidator })]
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