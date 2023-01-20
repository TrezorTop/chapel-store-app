import { DeleteUncommittedOrderParams, DeleteUncommittedOrderPath, DeleteUncommittedOrderResponse } from "../../../../shared/endpoints/me/deleteUncommittedOrder";
import {
  CreatePaymentPath,
  CreatePaymentRequest,
  CreatePaymentResponse,
} from "../../../../shared/endpoints/purchases/createPurchases";
import { api } from "../config/api";

export const createPayment = (data: CreatePaymentRequest) => api.post<CreatePaymentResponse>(CreatePaymentPath, data);
export const cancelPayment = ({ id }: DeleteUncommittedOrderParams) =>
  api.delete<DeleteUncommittedOrderResponse>(DeleteUncommittedOrderPath.replace(":id", id));
