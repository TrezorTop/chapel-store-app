import Cookies from "js-cookie";
import React from "react";
import { useNavigate } from "react-router-dom";

import { AuthLayout } from "../../../core/components/hoc/AuthLayout/AuthLayout";
import { Form } from "../../../core/components/hoc/Form/Form";
import { Button } from "../../../core/components/kit/Button/Button";
import { Input } from "../../../core/components/kit/Input/Input";
import { Paper } from "../../../core/components/kit/Paper/Paper";
import { MAIN_URL, SIGN_UP_URL, USER_ACCESS_TOKEN_KEY } from "../../../core/utils/consts";
import { useForm } from "../../../core/utils/hooks/useForm";
import { useSignIn } from "../../../core/services/user.service";
import s from "./SignIn.module.scss";

type TForm = {
  username: string;
  password: string;
};

export const SignIn = () => {
  const navigate = useNavigate();

  const { form, updateForm } = useForm<TForm>();

  const { mutate, isLoading } = useSignIn();

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
            Sign In
          </Button>
          <Button variant="text" onClick={() => navigate(SIGN_UP_URL)}>
            Sign Up
          </Button>
          {Cookies.get(USER_ACCESS_TOKEN_KEY) && (
            <Button variant="text" onClick={() => navigate(MAIN_URL)}>
              Proceed as User
            </Button>
          )}
        </Form>
      </Paper>
    </AuthLayout>
  );
};
