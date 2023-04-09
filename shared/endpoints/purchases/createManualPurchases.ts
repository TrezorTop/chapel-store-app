import { BasePath, PaymentsRootPath } from "../../index";


export const CreateManualPaymentBasePath = "/manual";

export const CreateManualPaymentPath = `${BasePath}${PaymentsRootPath}${CreateManualPaymentBasePath}`;

export type CreateManualPaymentRequest = {
	ownerUsername: string;
	bundleId: string;
};

export type CreateManualPaymentResponse = {};