import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { VeryBadThingsHappend } from "../../../../shared/consts/error";
import {
	ProceedPaymentYookassaBasePath,
	ProceedPaymentYookassaRequest
} from "../../../../shared/endpoints/purchases/proceedPaymentYookassa";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";
import { savePromocodeStatistic } from "./index";


export const proceedYookassa = async (instance: FastifyInstance) => {
	instance.post<{
		Body: ProceedPaymentYookassaRequest
	}>(ProceedPaymentYookassaBasePath, async (request, reply) => {
		const body = request.body;

		if (body.status === "pending")
			return reply.status(StatusCodes.OK).send();

		const order = await cancelIfFailed(() => prisma.uncommittedOrders.delete({
				where: {
					id: body.metadata.orderId
				},
				include: {
					bundle: true,
					promocode: true
				}
			}), StatusCodes.NOT_FOUND, VeryBadThingsHappend
		);
		if (body.status === "canceled")
			return reply.status(StatusCodes.OK).send();

		if (body.status !== "succeeded")
			return reply.status(StatusCodes.BAD_REQUEST).send();

		await prisma.$transaction(async (tx) => {
			if (order.promocode)
				// @ts-ignore
				await savePromocodeStatistic(order, tx);

			await tx.purchases.create({
				data: {
					ownerUsername: order.ownerUsername,
					bundleId: order.bundleId
				}
			});
		});

		return reply.status(StatusCodes.OK).send();
	});
};