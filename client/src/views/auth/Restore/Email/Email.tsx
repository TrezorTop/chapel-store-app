import { useMutation } from "@tanstack/react-query";
import React, { FC, useCallback } from "react";
import {
  RequestResetPasswordPath,
  RequestResetPasswordRequestValidator,
} from "../../../../../../shared/endpoints/auth/requestResetPassword";

import { Button } from "../../../../core/components/kit/Button/Button";
import { FormActions } from "../../../../core/components/kit/Form/FormActions/FormActions";
import { Input } from "../../../../core/components/kit/Input/Input";
import { requestResetPassword } from "../../../../core/services/user.service";
import { useForm } from "../../../../core/utils/hooks/useForm";

type TForm = {
  email: string;
};

type TEmailProps = {
  onSubmit: () => void;
};

export const Email: FC<TEmailProps> = ({ onSubmit }) => {
  const { form, updateForm, isFieldValid } = useForm<TForm>();

  const { isLoading } = useMutation([RequestResetPasswordPath], () => requestResetPassword({ email: form.email! }));

  const isValid = useCallback(() => {
    return !isLoading && isFieldValid(RequestResetPasswordRequestValidator.email.check, form.email);
  }, [form, isLoading]);

  return (
    <>
      <Input placeholder="Email" variant="outlined" onChange={(event) => updateForm({ email: event.target.value })} />
      <FormActions variant="vertical">
        <Button disabled={!isValid()} onClick={() => onSubmit()}>
          Continue
        </Button>
      </FormActions>
    </>
  );
};
