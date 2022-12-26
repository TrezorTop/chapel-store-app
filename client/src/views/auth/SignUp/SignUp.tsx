import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthLayout } from "../../../core/components/hoc/AuthLayout/AuthLayout";
import { Form } from "../../../core/components/hoc/Form/Form";
import { Button } from "../../../core/components/kit/Button/Button";
import { Input } from "../../../core/components/kit/Input/Input";
import { Paper } from "../../../core/components/kit/Paper/Paper";
import { SIGN_IN_URL } from "../../../core/utils/consts";
import { useSignUp } from "../../../core/services/user.service";
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

  const { mutate, isLoading } = useSignUp();

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
            onChange={(event) => updateForm("repeatedPassword", event.target.value)}
            disabled={isLoading}
          />
          <Button
            disabled={isLoading}
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
          <Button variant="text" onClick={() => navigate(SIGN_IN_URL)}>
            Sign In
          </Button>
        </Form>
      </Paper>
    </AuthLayout>
  );
};
