import React from "react";
import { useNavigate } from "react-router-dom";

import { AuthLayout } from "../../../core/components/hoc/AuthLayout/AuthLayout";
import { Form } from "../../../core/components/hoc/Form/Form";
import { Button } from "../../../core/components/ui/Button/Button";
import { Input } from "../../../core/components/ui/Input/Input";
import { Paper } from "../../../core/components/ui/Paper/Paper";
import s from "./SignIn.module.scss";

export const SignIn = () => {
  const navigate = useNavigate();

  // const { mutate } = useMutation(
  //   ["signUn"],
  //   () =>
  //     AuthService.signUp({
  //       username: form.username ?? "",
  //       password: form.password ?? "",
  //     }),
  //   {
  //     onSuccess: ({ data }) => {
  //       onUserLogin(data.accessToken);
  //       navigate(storeUrl);
  //     },
  //   },
  // );

  return (
    <AuthLayout>
      <Paper>
        <Form className={s.form}>
          <Input placeholder="Login" />
          <Input type="password" placeholder="Password" />
          <Button variant="contained" type="submit">
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
