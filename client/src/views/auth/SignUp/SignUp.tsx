import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthLayout } from "../../../core/components/hoc/AuthLayout/AuthLayout";
import { Form } from "../../../core/components/hoc/Form/Form";
import { Button } from "../../../core/components/ui/Button/Button";
import { Input } from "../../../core/components/ui/Input/Input";
import { Paper } from "../../../core/components/ui/Paper/Paper";
import { useSignUp } from "../../../core/utils/hooks/services/auth.service";
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
          <Button variant="text" onClick={() => navigate("/signin")}>
            Sign In
          </Button>
        </Form>
      </Paper>
    </AuthLayout>
  );
};
