import axios from "axios";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { CheckMyPaymentsBasePath, CheckMyPaymentsResponse } from "../../../../shared/endpoints/me/checkMyPayments";
import {
	ProceedPaymentYookassaPath,
	ProceedPaymentYookassaRequest
} from "../../../../shared/endpoints/purchases/proceedPaymentYookassa";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { PaymentMethod, prisma } from "../../infrastructure/prismaConnect";
import { Yookassa_CreateInvoiceResponse } from "../payments";


export const checkMyPayments = async (instance: FastifyInstance) => {
	instance.get<{
		Reply: CheckMyPaymentsResponse
	}>(CheckMyPaymentsBasePath, {
		onRequest: [jwtOnRequestHook()],
	}, async (request, reply) => {
		const orders = await prisma.uncommittedOrders.findMany({
			where: {
				ownerUsername: request.user.username,
				method: PaymentMethod.YOOKASSA
			}
		});
		const authKey = Buffer.from(`${process.env.YOOKASSA_SHOPID}:${process.env.YOOKASSA_KEY}`).toString("base64");

		for (let order of orders) {
			axios.get<Yookassa_CreateInvoiceResponse>(`https://api.yookassa.ru/v3/payments/${order.paymentId}`, {
				headers: {
					"Authorization": `Basic ${authKey}`
				}
			}).then(res => instance.inject({
				url: ProceedPaymentYookassaPath,
				method: "POST",
				payload: {
					status: res.data.status,
					metadata: {
						orderId: order.id
					}
				} satisfies ProceedPaymentYookassaRequest
			}));
		}

		return reply.status(StatusCodes.OK).send();
	});
};