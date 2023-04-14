import {
  DeleteUncommittedOrderParams,
  DeleteUncommittedOrderPath,
  DeleteUncommittedOrderResponse,
} from "../../../../shared/endpoints/me/deleteUncommittedOrder";
import {
  CreateManualPaymentPath,
  CreateManualPaymentRequest,
  CreateManualPaymentResponse,
} from "../../../../shared/endpoints/purchases/createManualPurchases";
import {
  CreatePaymentPath,
  CreatePaymentRequest,
  CreatePaymentResponse,
} from "../../../../shared/endpoints/purchases/createPurchases";
import { api } from "../config/api";

export const createPayment = (data: CreatePaymentRequest) => api.post<CreatePaymentResponse>(CreatePaymentPath, data);
export const cancelPayment = ({ id }: DeleteUncommittedOrderParams) =>
  api.delete<DeleteUncommittedOrderResponse>(DeleteUncommittedOrderPath.replace(":id", id));

export const createManualPurchase = (data: CreateManualPaymentRequest) =>
  api.post<CreateManualPaymentResponse>(CreateManualPaymentPath, data);
