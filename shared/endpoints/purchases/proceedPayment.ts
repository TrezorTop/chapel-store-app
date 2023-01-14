import { BasePath, PaymentsRootPath } from "../../index";


export const ProceedPaymentBasePath = "/proceed";

export const ProceedPaymentPath = `${BasePath}${PaymentsRootPath}${ProceedPaymentBasePath}`;

export type ProceedPaymentRequest = {
	status: "success" | "fail",
	order_id: string,
	invoice_id: string,
};