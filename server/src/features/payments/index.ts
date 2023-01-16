import { FastifyPluginAsync } from "fastify/types/plugin";
import { create } from "./create";
import { proceedCryptoCloud } from "./proceedCryptoCloud";
import { proceedYookassa } from "./proceedYookassa";


export const paymentsModule: FastifyPluginAsync = async (instance) => {
	instance.register(create);
	instance.register(proceedCryptoCloud);
	instance.register(proceedYookassa);
};


export type CryptoCloud_CreateInvoiceResponse = {
	status: "success" | "error",
	pay_url: string,
}

export type Yookassa_CreateInvoiceResponse = {
	status: "succeeded" | "canceled",
	confirmation: {
		confirmation_url: string
	}
}

export type YookassaMetadata = {
	orderId: string
}