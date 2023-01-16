import { BasePath, PaymentsRootPath } from "../../index";


export const ProceedPaymentCryptoCloudBasePath = "/proceed/cryptocloud";

export const ProceedPaymentCryptoCloudPath = `${BasePath}${PaymentsRootPath}${ProceedPaymentCryptoCloudBasePath}`;

export type ProceedPaymentCryptoCloudRequest = {
	status: "success" | "fail",
	order_id: string
};