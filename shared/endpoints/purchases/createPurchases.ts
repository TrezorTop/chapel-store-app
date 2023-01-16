import { BasePath, PaymentsRootPath } from "../../index";


export const CreatePaymentBasePath = "";

export const CreatePaymentPath = `${BasePath}${PaymentsRootPath}${CreatePaymentBasePath}`;

export enum PaymentMethod {
  CRYPTOCLOUD = "CRYPTOCLOUD",
  YOOKASSA = "YOOKASSA"
}

export type CreatePaymentRequest = {
  method: PaymentMethod
  bundleId: string;
  email?: string;
};

export type CreatePaymentResponse = {
  url: string;
};
