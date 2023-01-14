import { Role } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { VeryBadThingsHappend } from "../../../../shared/consts/error";
import { ProceedPaymentBasePath, ProceedPaymentRequest } from "../../../../shared/endpoints/purchases/proceedPayment";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";


export const proceed = async (instance: FastifyInstance) => {
	instance.post<{
		Body: ProceedPaymentRequest
	}>(ProceedPaymentBasePath, {
		onRequest: [jwtOnRequestHook({ requiredRole: Role.ADMIN })]
	}, async (request, reply) => {
		const body = request.body;

		const order = await cancelIfFailed(() => prisma.uncomittedOrders.delete({
				where: {
					id: body.order_id
				}
			}), StatusCodes.NOT_FOUND, VeryBadThingsHappend
		);
		await prisma.purchases.create({
			data: {
				ownerUsername: order.ownerUsername,
				bundleId: order.bundleId
			}
		});

		return reply.status(StatusCodes.OK).send();
	});
};