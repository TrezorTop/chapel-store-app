import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router-dom";

import { AuthLayout } from "../../../core/components/hoc/AuthLayout/AuthLayout";
import { Form } from "../../../core/components/hoc/Form/Form";
import { Button } from "../../../core/components/ui/Button/Button";
import { Input } from "../../../core/components/ui/Input/Input";
import { Paper } from "../../../core/components/ui/Paper/Paper";
import { signIn } from "../../../core/services/Auth.service";
import { mainUrl } from "../../../core/utils/consts";
import { updateAuthToken } from "../../../core/utils/functions/user";
import { useForm } from "../../../core/utils/hooks/useForm";
import s from "./SignIn.module.scss";

type TForm = {
  username: string;
  password: string;
};

export const SignIn = () => {
  const navigate = useNavigate();

  const { form, updateForm } = useForm<TForm>();

  const { mutate } = useMutation(
    ["signIn"],
    () =>
      signIn({
        username: form.username ?? "",
        password: form.password ?? "",
      }),
    {
      onSuccess: ({ data }) => {
        updateAuthToken(data.accessToken, data.refreshToken);
        navigate(mainUrl);
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
          />
          <Input
            type="password"
            placeholder="Password"
            onChange={(event) => updateForm("password", event.target.value)}
          />
          <Button variant="contained" type="submit" onClick={() => mutate()}>
            Sign In
          </Button>
          <Button variant="text" onClick={() => navigate("/signup")}>
            Sign Up
          </Button>
        </Form>
      </Paper>
    </AuthLayout>
  );
};
