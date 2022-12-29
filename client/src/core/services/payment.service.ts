import { GetAllConfigsPath, GetAllConfigsResponse } from "../../../../shared/endpoints/configs/getAllConfigs";
import {
  CreatePaymentPath,
  CreatePaymentRequest,
  CreatePaymentResponse,
} from "../../../../shared/endpoints/payments/createPayment";
import { api } from "../config/api";

export const createPayment = ({ configId }: CreatePaymentRequest) =>
  api.post<CreatePaymentResponse>(CreatePaymentPath, {
    configId,
  });

