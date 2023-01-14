import { CreatePaymentPath, CreatePaymentRequest, CreatePaymentResponse } from "../../../../shared/endpoints/purchases/createPurchases";
import { api } from "../config/api";

export const createPayment = ({ configId }: CreatePaymentRequest) =>
  api.post<CreatePaymentResponse>(CreatePaymentPath, {
    configId,
  });
