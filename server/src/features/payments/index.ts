import { Bundle, Prisma, Promocode, UncommittedOrders } from "@prisma/client";
import { FastifyPluginAsync } from "fastify/types/plugin";
import { create } from "./create";
import { proceedCryptoCloud } from "./proceedCryptoCloud";
import { proceedYookassa } from "./proceedYookassa";


export const paymentsModule: FastifyPluginAsync = async (instance) => {
	instance.register(create);
	instance.register(proceedCryptoCloud);
	instance.register(proceedYookassa);
};


export async function savePromocodeStatistic(
	uncommittedOrder: UncommittedOrders & { bundle: Bundle } & { promocode: Promocode },
	tx: Prisma.TransactionClient
) {
	const price = uncommittedOrder.bundle.price;
	const earnStreamer = uncommittedOrder.promocode.earnedStreamer;
	const discountToUser = uncommittedOrder.promocode.discountToUser;

	const payToStreamer = price.div(100).mul(earnStreamer);
	const savedToUser = price.div(100).mul(discountToUser);

	return tx.promocodeStatistic.create({
		data: {
			promocodeName: uncommittedOrder.promocodeName!,
			payToStreamer: payToStreamer,
			savedToUser: savedToUser
		}
	});
}


export type CryptoCloud_CreateInvoiceResponse = {
	status: "success" | "error",
	pay_url: string,
	invoice_id: string
}

export type Yookassa_CreateInvoiceResponse = {
	status: "succeeded" | "canceled" | "pending",
	id: string,
	confirmation: {
		confirmation_url: string
	}
}

export type YookassaMetadata = {
	orderId: string
}