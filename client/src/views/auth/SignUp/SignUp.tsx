import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthLayout } from "../../../core/components/hoc/AuthLayout/AuthLayout";
import { Form } from "../../../core/components/hoc/Form/Form";
import { Button } from "../../../core/components/kit/Button/Button";
import { Input } from "../../../core/components/kit/Input/Input";
import { Paper } from "../../../core/components/kit/Paper/Paper";
import { signUp } from "../../../core/services/Auth.service";
import { emptyUrl, signInUrl } from "../../../core/utils/consts";
import { updateAuthTokens } from "../../../core/utils/functions/auth";
import { useForm } from "../../../core/utils/hooks/useForm";
import s from "./SignUp.module.scss";

type TForm = {
  username: string;
  password: string;
  repeatedPassword: string;
};

export const SignUp = () => {
  const { form, updateForm, valid } = useForm<TForm>(
    {},
    {
      username: { required: true },
      password: { required: true },
      repeatedPassword: { required: true, isEqual: "password" },
    },
  );

  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation(
    ["signIn"],
    () =>
      signUp({
        username: form.username ?? "",
        password: form.password ?? "",
      }),
    {
      onSuccess: ({ data }) => {
        updateAuthTokens(data.accessToken, data.refreshToken);
        navigate(emptyUrl, { state: { requireAuth: false } });
      },
    },
  );

  return (
    <AuthLayout>
      <Paper>
        <Form className={s.form}>
          <Input
            variant="standard"
            type=""
            placeholder="Login"
            onChange={(event) => updateForm("username", event.target.value)}
            disabled={isLoading}
          />
          <Input
            variant="standard"
            type="password"
            placeholder="Password"
            onChange={(event) => updateForm("password", event.target.value)}
            disabled={isLoading}
          />
          <Input
            variant="standard"
            type="password"
            placeholder="Repeat password"
            onChange={(event) =>
              updateForm("repeatedPassword", event.target.value)
            }
            disabled={isLoading}
          />
          <Button
            disabled={!valid || isLoading}
            variant="contained"
            type="submit"
            onClick={() =>
              mutate({
                username: form.username ?? "",
                password: form.password ?? "",
              })
            }
          >
            Sign Up
          </Button>
          <Button variant="text" onClick={() => navigate(signInUrl)}>
            Sign In
          </Button>
        </Form>
      </Paper>
    </AuthLayout>
  );
};
