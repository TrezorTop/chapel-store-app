import { CircularProgress, MenuItem } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";

import { CreatePurchases_BundleNotFound, ErrorResponse } from "../../../../../shared/consts/error";
import { GetByIdConfigsPath } from "../../../../../shared/endpoints/configs/getById";
import { ApplyPromocodesPath } from "../../../../../shared/endpoints/promocodes/applyPromocodes";
import { CreatePaymentPath, PaymentMethodEnum } from "../../../../../shared/endpoints/purchases/createPurchases";
import { Button } from "../../../core/components/kit/Button/Button";
import { Form } from "../../../core/components/kit/Form/Form";
import { Input } from "../../../core/components/kit/Input/Input";
import { Paper } from "../../../core/components/kit/Paper/Paper";
import { Typography } from "../../../core/components/kit/Typography/Typography";
import { applyPromocode, getBundle } from "../../../core/services/main.service";
import { createPayment } from "../../../core/services/payment.service";
import { formatCurrency } from "../../../core/utils/functions/number";
import { useForm } from "../../../core/utils/hooks/useForm";
import s from "./Payment.module.scss";

type TForm = {
  selectedPayment: PaymentMethodEnum;
  promocode: string;
  email: string;
};

export const Payment = () => {
  const [savedPromocode, setSavedPromocode] = useState<string>("");

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
    () =>
      createPayment({
        bundleId: bundleId!,
        email: form.email,
        method: form.selectedPayment!,
        promocodeName: savedPromocode,
      }),
    {
      onSuccess: ({ data }) => {
        window.open(data.url, "_blank");
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        if (error.response?.data.message === CreatePurchases_BundleNotFound) {
          setError("You have already purchased this bundle");
        }
      },
    },
  );

  const {
    mutate: mutateApplyPromocode,
    isLoading: isLoadingApplyPromocode,
    data: applyPromocodeData,
  } = useMutation([ApplyPromocodesPath], applyPromocode, {
    onSuccess: ({ data }) => {
      setSavedPromocode(form.promocode ?? "");
    },
  });

  useEffect(() => {
    if (!bundleId) return;

    refetch();
  }, [bundleId]);

  const isValid = useCallback(() => {
    if (isLoadingConfig || isLoadingPayment) return false;

    return form.selectedPayment;
  }, [form.email, form.selectedPayment, isLoadingConfig, isLoadingPayment]);

  const isValidPromocode = useCallback(() => {
    if (isLoadingApplyPromocode) return false;

    return form.promocode;
  }, [form.promocode, isLoadingApplyPromocode]);

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
              {formatCurrency(
                (applyPromocodeData?.data?.price as unknown as number) ?? +configData?.data.bundle?.price!,
              )}
            </Typography>
            <Typography variant="h6" marginBottom>
              {savedPromocode && <>Applied Promocode {savedPromocode}</>}
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
          onChange={(event) => updateForm({ email: event.target.value })}
        />

        <Input
          placeholder="Promocode (Optional)"
          fullWidth
          inputLabel="Enter the promo code if you have one"
          onChange={(event) => updateForm({ promocode: event.target.value })}
        />

        <Button
          disabled={!isValidPromocode()}
          variant="outlined"
          size="large"
          fullWidth
          onClick={() => mutateApplyPromocode({ bundleId: bundleId!, name: form.promocode! })}
        >
          Apply Promocode
        </Button>

        <Input
          placeholder="Payment Method"
          fullWidth
          inputLabel="Select payment method"
          onChange={(event) => updateForm({ selectedPayment: event.target.value as PaymentMethodEnum })}
          value={form.selectedPayment}
          select
        >
          {Object.keys(PaymentMethodEnum).map((key, index) => (
            <MenuItem disabled={key===YOOKASSA} key={index} value={key}>
              {key}
            </MenuItem>
          ))}
        </Input>

        {error ? (
          <Typography textAlign="center">{error}</Typography>
        ) : (
          <Button disabled={!isValid()} color="success" size="large" fullWidth onClick={() => mutateCreatePayment()}>
            {isLoadingConfig || isLoadingPayment ? <CircularProgress size={23} color="success" /> : <>Continue</>}
          </Button>
        )}
      </Form>
    </>
  );
};
