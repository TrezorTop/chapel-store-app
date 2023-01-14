import { BasePath, PaymentsRootPath } from "../../index";

export const CreatePaymentBasePath = "";

export const CreatePaymentPath = `${BasePath}${PaymentsRootPath}${CreatePaymentBasePath}`;

export type CreatePaymentRequest = {
  bundleId: string;
  email?: string;
};

export type CreatePaymentResponse = {
  url: string;
};
