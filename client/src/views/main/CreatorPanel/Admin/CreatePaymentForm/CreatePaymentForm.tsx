import { Autocomplete } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FC, useCallback, useState } from "react";
import { CreateManualPurchases_BundleNotFound, ErrorResponse } from "../../../../../../../shared/consts/error";
import { GetAllBundlesPath } from "../../../../../../../shared/endpoints/bundles/getAllBundles";
import { CreateManualPaymentPath } from "../../../../../../../shared/endpoints/purchases/createManualPurchases";
import { GetAllUsersPath } from "../../../../../../../shared/endpoints/users/getAllUsers";
import { Button } from "../../../../../core/components/kit/Button/Button";
import { Form } from "../../../../../core/components/kit/Form/Form";
import { FormActions } from "../../../../../core/components/kit/Form/FormActions/FormActions";
import { Input } from "../../../../../core/components/kit/Input/Input";
import { Typography } from "../../../../../core/components/kit/Typography/Typography";
import { getBundles } from "../../../../../core/services/main.service";
import { createManualPurchase } from "../../../../../core/services/payment.service";
import { getAllUsers } from "../../../../../core/services/users.service";
import { useForm } from "../../../../../core/utils/hooks/useForm";

type TProps = {
  onClose: () => void;
};

type TForm = {
  user: string;
  bundleId: string;
};

export const CreatePaymentForm: FC<TProps> = ({ onClose }) => {
  const { data: usersData } = useQuery([GetAllUsersPath], getAllUsers);

  const { form, updateForm, error, setError } = useForm<TForm>({
    bundleId: "",
    user: "",
  });

  const { data: bundlesData } = useQuery([GetAllBundlesPath], () => getBundles({ role: "USER" }));

  const { mutate } = useMutation(
    [CreateManualPaymentPath],
    () => createManualPurchase({ bundleId: form.bundleId!, ownerUsername: form.user! }),
    {
      onSuccess: () => {
        onClose();
      },
      onError: ({ response }: AxiosError<ErrorResponse>) => {
        if (response?.data.message === CreateManualPurchases_BundleNotFound) setError("User already has this bundle");
      },
    },
  );

  const isValid = useCallback(() => {
    return form.bundleId && form.user;
  }, [form.bundleId, form.user]);

  return (
    <Form>
      <Autocomplete
        disabled={!usersData}
        onChange={(event, value) => {
          updateForm({ user: value ?? "" });
        }}
        options={usersData?.data.users.map((user) => user.username) ?? []}
        getOptionLabel={(option) => usersData?.data.users.find((user) => user.username === option)?.username ?? ""}
        renderInput={(params) => <Input {...params} fullWidth value={form.user} inputLabel="Select User" />}
      />

      <Autocomplete
        value={form.bundleId}
        disabled={!bundlesData}
        onChange={(event, value) => {
          updateForm({ bundleId: value ?? "" });
        }}
        options={bundlesData?.data.bundles.map((bundle) => bundle.id) ?? []}
        getOptionLabel={(option) => bundlesData?.data.bundles.find((bundle) => bundle.id === option)?.name ?? ""}
        renderInput={(params) => <Input {...params} fullWidth value={form.bundleId} inputLabel="Select Bundle" />}
      />
      {error && (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      )}
      <FormActions>
        <Button disabled={!isValid()} onClick={() => mutate()}>
          Submit
        </Button>
      </FormActions>
    </Form>
  );
};
