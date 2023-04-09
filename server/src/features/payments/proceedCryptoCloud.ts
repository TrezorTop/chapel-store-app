import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { VeryBadThingsHappend } from "../../../../shared/consts/error";
import {
	ProceedPaymentCryptoCloudBasePath,
	ProceedPaymentCryptoCloudRequest
} from "../../../../shared/endpoints/purchases/proceedPaymentCryptocloud";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";
import { savePromocodeStatistic } from "./index";


export const proceedCryptoCloud = async (instance: FastifyInstance) => {
	instance.post<{
		Body: ProceedPaymentCryptoCloudRequest
	}>(ProceedPaymentCryptoCloudBasePath, async (request, reply) => {
		const body = request.body;

		const order = await cancelIfFailed(() => prisma.uncommittedOrders.delete({
				where: {
					id: body.order_id
				},
				include: {
					bundle: true,
					promocode: true
				}
			}), StatusCodes.NOT_FOUND, VeryBadThingsHappend
		);
		if (body.status === "fail")
			return reply.status(StatusCodes.BAD_REQUEST).send();
		if (body.status !== "success")
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