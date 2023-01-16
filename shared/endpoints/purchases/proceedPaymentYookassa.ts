import { Yookassa_CreateInvoiceResponse, YookassaMetadata } from "../../../server/src/features/purchases";
import { BasePath, PaymentsRootPath } from "../../index";


export const ProceedPaymentYookassaBasePath = "/proceed/yookassa";

export const ProceedPaymentYookassaPath = `${BasePath}${PaymentsRootPath}${ProceedPaymentYookassaBasePath}`;

export type ProceedPaymentYookassaRequest = {
	status: Yookassa_CreateInvoiceResponse["status"],
	metadata: YookassaMetadata
};