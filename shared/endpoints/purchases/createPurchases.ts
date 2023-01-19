import { PaymentMethod } from "../../../server/src/infrastructure/prismaConnect";
import { BasePath, PaymentsRootPath } from "../../index";

export const CreatePaymentBasePath = "";

export const CreatePaymentPath = `${BasePath}${PaymentsRootPath}${CreatePaymentBasePath}`;

export type CreatePaymentRequest = {
  method: PaymentMethod;
  bundleId: string;
  email?: string;
};

export type CreatePaymentResponse = {
  url: string;
};

export enum PaymentMethodEnum {
  YOOKASSA = "YOOKASSA",
  CRYPTOCLOUD = "CRYPTOCLOUD",
}
