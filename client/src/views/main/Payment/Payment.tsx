import { CircularProgress, MenuItem } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";

import { CreatePurchases_BundleNotFound } from "../../../../../shared/consts/error";
import { GetByIdConfigsPath } from "../../../../../shared/endpoints/configs/getById";
import { CreatePaymentPath, PaymentMethodEnum } from "../../../../../shared/endpoints/purchases/createPurchases";
import { Button } from "../../../core/components/kit/Button/Button";
import { Form } from "../../../core/components/kit/Form/Form";
import { Input } from "../../../core/components/kit/Input/Input";
import { Paper } from "../../../core/components/kit/Paper/Paper";
import { Typography } from "../../../core/components/kit/Typography/Typography";
import { getBundle } from "../../../core/services/main.service";
import { createPayment } from "../../../core/services/payment.service";
import { formatCurrency } from "../../../core/utils/functions/number";
import { useForm } from "../../../core/utils/hooks/useForm";
import s from "./Payment.module.scss";

type TForm = {
  selectedPayment: PaymentMethodEnum;
  email: string;
};

export const Payment = () => {
  const { form, updateForm, error, setError } = useForm<TForm>({ selectedPayment: PaymentMethodEnum.YOOKASSA });

  const { bundleId } = useParams<{ bundleId: string }>();

  const {
    data: configData,
    refetch,
    isLoading: isLoadingConfig,
  } = useQuery([GetByIdConfigsPath], () => getBundle({ id: bundleId! }), {
    enabled: !!bundleId,
  });

  const { mutate: mutateCreatePayment, isLoading: isLoadingPayment } = useMutation(
    [CreatePaymentPath],
    () => createPayment({ bundleId: bundleId!, email: form.email, method: form.selectedPayment! }),
    {
      onSuccess: ({ data }) => {
        window.open(data.url, "_blank");
      },
      onError: (error: any) => {
        if (error.response?.data.message === CreatePurchases_BundleNotFound) {
          setError("You have already purchased this bundle");
        }
      },
    },
  );

  useEffect(() => {
    if (!bundleId) return;

    refetch();
  }, [bundleId]);

  const isValid = useCallback(() => {
    if (isLoadingConfig || isLoadingPayment) return false;

    return form.selectedPayment;
  }, [form, isLoadingConfig, isLoadingPayment]);

  return (
    <>
      <Typography variant="h4" marginBottom>
        Payment
      </Typography>

      <Paper className={s.info} variant="elevation">
        {configData && (
          <>
            <Typography variant="h5" marginBottom>
              {configData?.data.bundle?.name}
            </Typography>
            <Typography variant="h5" marginBottom>
              {formatCurrency(+configData?.data.bundle?.price!)}
            </Typography>
            <div className={s.items}>
              {configData?.data.bundle?.configs.map((config) => (
                <Paper key={config.config.id}>
                  <Typography variant="body1">{config.config.title}</Typography>
                </Paper>
              ))}
            </div>
          </>
        )}
      </Paper>

      <Form>
        <Input
          placeholder="Email (Optional)"
          fullWidth
          inputLabel="Send payment info to"
          variant="outlined"
          onChange={(event) => updateForm({ email: event.target.value })}
        />

        <Input
          placeholder="Payment Method"
          fullWidth
          inputLabel="Send payment info to"
          variant="outlined"
          onChange={(event) => updateForm({ selectedPayment: event.target.value as PaymentMethodEnum })}
          value={form.selectedPayment}
          select
        >
          {Object.keys(PaymentMethodEnum).map((key, index) => (
            <MenuItem key={index} value={key}>
              {key}
            </MenuItem>
          ))}
        </Input>

        {error ? (
          <Typography textAlign="center">You have already purchased this bundle</Typography>
        ) : (
          <Button
            disabled={!isValid()}
            variant="outlined"
            color="success"
            size="large"
            fullWidth
            onClick={() => mutateCreatePayment()}
          >
            {isLoadingConfig || isLoadingPayment ? <CircularProgress size={23} color="success" /> : <>Continue</>}
          </Button>
        )}
      </Form>
    </>
  );
};
