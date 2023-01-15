import { useMutation } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { RegisterPath, RegisterRequestValidator } from "../../../../../shared/endpoints/auth/register";
import { Button } from "../../../core/components/kit/Button/Button";
import { Form } from "../../../core/components/kit/Form/Form";
import { Input } from "../../../core/components/kit/Input/Input";
import { signUp } from "../../../core/services/user.service";
import { MAIN_URL, SIGN_IN_URL } from "../../../core/utils/consts/urls";
import { updateAuthTokens } from "../../../core/utils/functions/auth";
import { useForm } from "../../../core/utils/hooks/useForm";
import { Window } from "../components/Window/Window";
import s from "./SignUp.module.scss";

type TForm = {
  username: string;
  password: string;
  repeatedPassword: string;
  email: string;
};

export const SignUp = () => {
  const { form, updateForm, isFieldValid } = useForm<TForm>();

  const navigate = useNavigate();

  const { isLoading, mutate } = useMutation([RegisterPath], signUp, {
    onSuccess: ({ data }) => {
      updateAuthTokens(data.accessToken, data.refreshToken);
      navigate(MAIN_URL);
    },
  });

  const isValid = useCallback(() => {
    return (
      !isLoading &&
      isFieldValid(RegisterRequestValidator.username.check, form.username) &&
      isFieldValid(RegisterRequestValidator.password.check, form.password) &&
      form.repeatedPassword === form.password
    );
  }, [form.password, form.repeatedPassword, form.username, isLoading]);

  return (
    <Window>
      <Form className={s.form}>
        <Input
          placeholder="Login"
          onChange={(event) => updateForm({ username: event.target.value })}
          disabled={isLoading}
        />
        <Input
          placeholder="Email"
          onChange={(event) => updateForm({ email: event.target.value })}
          disabled={isLoading}
        />
        <Input
          type="password"
          placeholder="Password"
          onChange={(event) => updateForm({ password: event.target.value })}
          disabled={isLoading}
        />
        <Input
          type="password"
          placeholder="Repeat password"
          onChange={(event) => updateForm({ repeatedPassword: event.target.value })}
          disabled={isLoading}
        />
        <Button
          disabled={!isValid()}
          variant="contained"
          type="submit"
          onClick={() =>
            mutate({
              username: form.username ?? "",
              email: form.email ?? "",
              password: form.password ?? "",
            })
          }
        >
          Sign Up
        </Button>
        <Button variant="text" onClick={() => navigate(`../${SIGN_IN_URL}`)}>
          Sign In
        </Button>
      </Form>
    </Window>
  );
};
