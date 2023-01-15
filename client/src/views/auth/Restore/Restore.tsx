import { useMutation } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router";

import {
  ConfirmResetPasswordPath,
  ConfirmResetPasswordValidator,
} from "../../../../../shared/endpoints/auth/confirmResetPassword";
import {
  RequestResetPasswordPath,
  RequestResetPasswordRequestValidator,
} from "../../../../../shared/endpoints/auth/requestResetPassword";
import { Button } from "../../../core/components/kit/Button/Button";
import { Form } from "../../../core/components/kit/Form/Form";
import { FormActions } from "../../../core/components/kit/Form/FormActions/FormActions";
import { Input } from "../../../core/components/kit/Input/Input";
import { confirmResetPassword, requestResetPassword } from "../../../core/services/user.service";
import { SIGN_IN_URL } from "../../../core/utils/consts/urls";
import { useForm } from "../../../core/utils/hooks/useForm";
import { Window } from "../components/Window/Window";

type TForm = {
  email: string;
  code: string;
  password: string;
};

enum Step {
  Initial,
  Confirm,
}

export const Restore = () => {
  const { form, updateForm, isFieldValid } = useForm<TForm>();
  const [step, setStep] = useState<Step>(Step.Initial);
  const navigate = useNavigate();

  const { isLoading: isLoadingRequest, mutate: mutateRequest } = useMutation(
    [RequestResetPasswordPath],
    () => requestResetPassword({ email: form.email! }),
    {
      onSuccess: () => {
        setStep(Step.Confirm);
      },
    },
  );

  const { isLoading: isLoadingConfirm, mutate: mutateConfirm } = useMutation(
    [ConfirmResetPasswordPath],
    () =>
      confirmResetPassword({
        password: form.password!,
        token: form.code!,
      }),
    {
      onSuccess: () => {
        navigate(`../${SIGN_IN_URL}`);
      },
    },
  );

  const isValid = useCallback(() => {
    if (step === Step.Initial)
      return !isLoadingRequest && isFieldValid(RequestResetPasswordRequestValidator.email.check, form.email);

    if (step === Step.Confirm)
      return (
        !isLoadingConfirm && form.code && isFieldValid(ConfirmResetPasswordValidator.password.check, form.password)
      );
  }, [form, isLoadingRequest, isLoadingConfirm]);

  return (
    <Window header="Password Restoration">
      <Form>
        <Input
          disabled={step !== Step.Initial}
          placeholder="Email"
          onChange={(event) => updateForm({ email: event.target.value })}
        />
        <Input
          disabled={step !== Step.Confirm}
          type="password"
          placeholder="New Password"
          onChange={(event) => updateForm({ password: event.target.value })}
        />
        <Input
          disabled={step !== Step.Confirm}
          placeholder="Code"
          onChange={(event) => updateForm({ code: event.target.value })}
        />
        <FormActions variant="vertical">
          <Button
            disabled={!isValid()}
            onClick={() => {
              if (step === Step.Initial) mutateRequest();
              else if (step === Step.Confirm) mutateConfirm();
            }}
          >
            Continue
          </Button>
          <Button variant="text" onClick={() => navigate(`../${SIGN_IN_URL}`)}>
            Sign In
          </Button>
        </FormActions>
      </Form>
    </Window>
  );
};
