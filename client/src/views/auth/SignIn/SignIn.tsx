import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import React from "react";
import { useNavigate } from "react-router-dom";

import { AuthLayout } from "../../../core/components/hoc/AuthLayout/AuthLayout";
import { Form } from "../../../core/components/hoc/Form/Form";
import { Button } from "../../../core/components/kit/Button/Button";
import { Input } from "../../../core/components/kit/Input/Input";
import { Paper } from "../../../core/components/kit/Paper/Paper";
import { signIn } from "../../../core/services/Auth.service";
import {
  mainUrl,
  signUpUrl,
  userAccessToken,
} from "../../../core/utils/consts";
import { updateAuthTokens } from "../../../core/utils/functions/auth";
import { useForm } from "../../../core/utils/hooks/useForm";
import s from "./SignIn.module.scss";

type TForm = {
  username: string;
  password: string;
};

export const SignIn = () => {
  const navigate = useNavigate();

  const { form, updateForm, valid } = useForm<TForm>(
    {},
    { password: { required: true }, username: { required: true } },
  );

  const { mutate, isLoading } = useMutation(
    ["signIn"],
    () =>
      signIn({
        username: form.username ?? "",
        password: form.password ?? "",
      }),
    {
      onSuccess: ({ data }) => {
        updateAuthTokens(data.accessToken, data.refreshToken);
        navigate(mainUrl, { state: { requireAuth: false } });
      },
    },
  );

  return (
    <AuthLayout>
      <Paper>
        <Form className={s.form}>
          <Input
            placeholder="Login"
            onChange={(event) => updateForm("username", event.target.value)}
            disabled={isLoading}
          />
          <Input
            type="password"
            placeholder="Password"
            onChange={(event) => updateForm("password", event.target.value)}
            disabled={isLoading}
          />
          <Button
            disabled={!valid || isLoading}
            variant="contained"
            type="submit"
            onClick={() => mutate()}
          >
            Sign In
          </Button>
          <Button variant="text" onClick={() => navigate(signUpUrl)}>
            Sign Up
          </Button>
          {Cookies.get(userAccessToken) && (
            <Button variant="text" onClick={() => navigate(mainUrl)}>
              Proceed as User
            </Button>
          )}
        </Form>
      </Paper>
    </AuthLayout>
  );
};
