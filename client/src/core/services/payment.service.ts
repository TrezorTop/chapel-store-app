import {
  CreatePaymentPath,
  CreatePaymentRequest,
  CreatePaymentResponse,
} from "../../../../shared/endpoints/purchases/createPurchases";
import { api } from "../config/api";

export const createPayment = (data: CreatePaymentRequest) => api.post<CreatePaymentResponse>(CreatePaymentPath, data);
