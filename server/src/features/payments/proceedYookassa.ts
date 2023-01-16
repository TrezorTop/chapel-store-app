import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { VeryBadThingsHappend } from "../../../../shared/consts/error";
import {
	ProceedPaymentYookassaBasePath,
	ProceedPaymentYookassaRequest
} from "../../../../shared/endpoints/purchases/proceedPaymentYookassa";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";


export const proceedYookassa = async (instance: FastifyInstance) => {
	instance.post<{
		Body: ProceedPaymentYookassaRequest
	}>(ProceedPaymentYookassaBasePath, async (request, reply) => {
		const body = request.body;

		const order = await cancelIfFailed(() => prisma.uncomittedOrders.delete({
				where: {
					id: body.metadata.orderId
				}
			}), StatusCodes.NOT_FOUND, VeryBadThingsHappend
		);
		if (body.status === "canceled")
			return reply.status(StatusCodes.BAD_REQUEST).send();

		if (body.status !== "succeeded")
			return reply.status(StatusCodes.BAD_REQUEST).send();


		await prisma.purchases.create({
			data: {
				ownerUsername: order.ownerUsername,
				bundleId: order.bundleId
			}
		});

		return reply.status(StatusCodes.OK).send();
	});
};