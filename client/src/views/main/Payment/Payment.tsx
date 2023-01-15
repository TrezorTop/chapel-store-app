import { CircularProgress, MenuItem } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";

import { GetByIdConfigsPath } from "../../../../../shared/endpoints/configs/getById";
import { CreatePaymentPath } from "../../../../../shared/endpoints/purchases/createPurchases";
import { Button } from "../../../core/components/kit/Button/Button";
import { Form } from "../../../core/components/kit/Form/Form";
import { Input } from "../../../core/components/kit/Input/Input";
import { Typography } from "../../../core/components/kit/Typography/Typography";
import { getBundle } from "../../../core/services/main.service";
import { createPayment } from "../../../core/services/payment.service";
import { formatCurrency } from "../../../core/utils/functions/number";
import { useForm } from "../../../core/utils/hooks/useForm";

type TPayment = "CRYPTO" | "CREDIT_CARD";

type TForm = {
  selectedPayment: TPayment;
  email: string;
};

export const Payment = () => {
  const { form, updateForm } = useForm<TForm>({ selectedPayment: "CRYPTO" });

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
    () => createPayment({ bundleId: bundleId!, email: form.email }),
    {
      onSuccess: ({ data }) => {
        window.open(data.url, "_blank");
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
      {configData && (
        <>
          <Typography variant="h5">{configData?.data.bundle?.name}</Typography>
          <Typography variant="h5">{formatCurrency(+configData?.data.bundle?.price!)}</Typography>
          <Typography variant="h5">{configData?.data.bundle?.configs.map((config) => config.config.title)}</Typography>
        </>
      )}
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
          onChange={(event) => updateForm({ selectedPayment: event.target.value as TPayment })}
          value={form.selectedPayment}
          select
        >
          <MenuItem disabled value={"CREDIT_CARD"}>
            Credit Card
          </MenuItem>
          <MenuItem value={"CRYPTO"}>Crypto</MenuItem>
        </Input>

        <Button
          disabled={!isValid()}
          variant="outlined"
          color="success"
          size="large"
          fullWidth
          onClick={() => mutateCreatePayment()}
        >
          {isLoadingConfig || isLoadingPayment ? <CircularProgress size={25} color="success" /> : <>Continue</>}
        </Button>
      </Form>
    </>
  );
};
