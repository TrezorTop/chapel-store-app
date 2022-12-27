import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

import { ErrorResponse } from "../../../../shared/consts/error";
import { GetAllConfigsPath, GetAllConfigsResponse } from "../../../../shared/endpoints/configs/getAllConfigs";
import {
  CreatePaymentPath,
  CreatePaymentRequest,
  CreatePaymentResponse,
} from "../../../../shared/endpoints/payments/createPayment";
import { api } from "../config/api";
import { PROFILE_URL } from "../utils/consts";

export const useCreatePayment = () => {
  const navigate = useNavigate();

  return useMutation<AxiosResponse<CreatePaymentRequest>, AxiosError<ErrorResponse>, CreatePaymentRequest>(
    [CreatePaymentPath],
    ({ configId }) =>
      api.post(CreatePaymentPath, {
        configId,
      }),
    {
      onSuccess: ({ data }) => {
        navigate(PROFILE_URL);
      },
    },
  );
};

export const useUserConfigs = () => {
  return useQuery<AxiosResponse<GetAllConfigsResponse>, AxiosError<ErrorResponse>>([GetAllConfigsPath], () =>
    api.get(GetAllConfigsPath),
  );
};
