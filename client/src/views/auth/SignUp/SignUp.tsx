import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginPath } from "../../../../../shared/endpoints/auth/login";

import { RegisterPath, RegisterRequestValidator } from "../../../../../shared/endpoints/auth/register";
import { VerifyEmailPath } from "../../../../../shared/endpoints/auth/verifyEmail";
import { Button } from "../../../core/components/kit/Button/Button";
import { Form } from "../../../core/components/kit/Form/Form";
import { FormActions } from "../../../core/components/kit/Form/FormActions/FormActions";
import { Input } from "../../../core/components/kit/Input/Input";
import { signIn, signUp, verifyEmail } from "../../../core/services/user.service";
import { MAIN_URL, SIGN_IN_URL } from "../../../core/utils/consts/urls";
import { updateAuthTokens } from "../../../core/utils/functions/auth";
import { useForm } from "../../../core/utils/hooks/useForm";
import { Window } from "../components/Window/Window";

enum Step {
  Initial,
  Confirm,
}

type TForm = {
  username: string;
  password: string;
  repeatedPassword: string;
  email: string;
  code: string;
};

export const SignUp = () => {
  const [step, setStep] = useState<Step>(Step.Initial);
  const { form, updateForm, isFieldValid } = useForm<TForm>();

  const navigate = useNavigate();

  const { isLoading, mutate: mutateSignUp } = useMutation([RegisterPath], signUp, {
    onSuccess: () => {
      setStep(Step.Confirm);
    },
  });

  const { mutate: mutateVerify } = useMutation([VerifyEmailPath], () => verifyEmail({ token: form.code! }), {
    onSuccess: () => {
      setTimeout(() => mutateLogin(), 500);
    },
  });

  const { mutate: mutateLogin } = useMutation(
    [LoginPath],
    () => signIn({ username: form.username!, password: form.password! }),
    {
      onSuccess: ({ data }) => {
        updateAuthTokens(data.accessToken, data.refreshToken);
        navigate(MAIN_URL);
      },
    },
  );

  const isValid = useCallback(() => {
    if (step === Step.Initial)
      return (
        !isLoading &&
        isFieldValid(RegisterRequestValidator.username.check, form.username) &&
        isFieldValid(RegisterRequestValidator.password.check, form.password) &&
        isFieldValid(RegisterRequestValidator.email.check, form.email) &&
        form.repeatedPassword === form.password
      );

    if (step === Step.Confirm) return form.code;
  }, [form, isLoading]);

  return (
    <Window header="Registration">
      <Form>
        <Input
          placeholder="Login"
          onChange={(event) => updateForm({ username: event.target.value })}
          disabled={isLoading || step !== Step.Initial}
        />
        <Input
          type="password"
          placeholder="Password"
          onChange={(event) => updateForm({ password: event.target.value })}
          disabled={isLoading || step !== Step.Initial}
        />
        <Input
          type="password"
          placeholder="Repeat password"
          onChange={(event) => updateForm({ repeatedPassword: event.target.value })}
          disabled={isLoading || step !== Step.Initial}
        />
        <Input
          placeholder="Email"
          onChange={(event) => updateForm({ email: event.target.value })}
          disabled={isLoading || step !== Step.Initial}
        />

        {step === Step.Confirm && (
          <Input
            type="password"
            placeholder="Confirm Code"
            onChange={(event) => updateForm({ code: event.target.value })}
            disabled={isLoading}
          />
        )}

        <FormActions variant="vertical">
          <Button
            disabled={!isValid()}
            variant="contained"
            type="submit"
            onClick={() => {
              if (step === Step.Initial)
                mutateSignUp({
                  username: form.username ?? "",
                  email: form.email ?? "",
                  password: form.password ?? "",
                });
              else if (step === Step.Confirm) mutateVerify();
            }}
          >
            {step === Step.Initial && "Sign Up"}
            {step === Step.Confirm && "Confirm"}
          </Button>
          <Button variant="text" onClick={() => navigate(`../${SIGN_IN_URL}`)}>
            Sign In
          </Button>
        </FormActions>
      </Form>
    </Window>
  );
};
