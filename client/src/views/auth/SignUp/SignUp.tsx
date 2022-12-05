import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthLayout } from "../../../core/components/hoc/AuthLayout/AuthLayout";
import { Form } from "../../../core/components/hoc/Form/Form";
import { Button } from "../../../core/components/ui/Button/Button";
import { Input } from "../../../core/components/ui/Input/Input";
import { Paper } from "../../../core/components/ui/Paper/Paper";
import { AuthService } from "../../../core/services/Auth.service";
import { emptyUrl } from "../../../core/utils/consts";
import { onUserLogin } from "../../../core/utils/functions/user";
import { useForm } from "../../../core/utils/hooks/useForm";
import s from "./SignUp.module.scss";

type TForm = {
  username: string;
  password: string;
  repeatedPassword: string;
};

export const SignUp = () => {
  const { form, updateForm } = useForm<TForm>();

  const navigate = useNavigate();

  const { mutate } = useMutation(
    ["signIn"],
    () =>
      AuthService.signUp({
        username: form.username ?? "",
        password: form.password ?? "",
      }),
    {
      onSuccess: ({ data }) => {
        onUserLogin(data.accessToken);
        navigate(emptyUrl);
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
          />
          <Input
            variant="standard"
            type="password"
            placeholder="Password"
            onChange={(event) => updateForm("password", event.target.value)}
          />
          <Input
            variant="standard"
            type="password"
            placeholder="Repeat password"
            onChange={(event) =>
              updateForm("repeatedPassword", event.target.value)
            }
          />
          <Button variant="contained" type="submit" onClick={() => mutate()}>
            Sign Up
          </Button>
          <Button variant="text" onClick={() => navigate("/signin")}>
            Sign In
          </Button>
        </Form>
      </Paper>
    </AuthLayout>
  );
};
