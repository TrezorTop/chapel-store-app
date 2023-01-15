import { FastifyPluginAsync } from "fastify/types/plugin";
import { create } from "./create";
import { proceed } from "./proceed";


export const paymentsModule: FastifyPluginAsync = async (instance) => {
	instance.register(create);
	instance.register(proceed);
};


export type CreateInvoiceResponse = {
	status: "success" | "error",
	pay_url: string,
	invoice_id: string,
	currency: string
}