import React from "react";
import { useNavigate } from "react-router-dom";

import { AuthLayout } from "../../../core/components/hoc/AuthLayout/AuthLayout";
import { Form } from "../../../core/components/hoc/Form/Form";
import { Button } from "../../../core/components/ui/Button/Button";
import { Error } from "../../../core/components/ui/Error/Error";
import { Input } from "../../../core/components/ui/Input/Input";
import { Paper } from "../../../core/components/ui/Paper/Paper";
import { useSignIn } from "../../../core/utils/hooks/services/auth.service";
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

  const { mutate, isLoading, error } = useSignIn();

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
            onClick={() =>
              mutate({
                username: form.username ?? "",
                password: form.password ?? "",
              })
            }
          >
            Sign In
          </Button>
          <Button variant="text" onClick={() => navigate("/signup")}>
            Sign Up
          </Button>
          <Error>{error?.response?.data.message}</Error>
        </Form>
      </Paper>
    </AuthLayout>
  );
};
