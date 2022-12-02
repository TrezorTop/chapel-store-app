import { Button, Input } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router-dom";

import { AuthLayout } from "../../../core/components/hoc/AuthLayout/AuthLayout";
import { Form } from "../../../core/components/hoc/Form/Form";
import { AuthService } from "../../../core/services/Auth.service";
import s from "./SignUp.module.scss";

export const SignUp = () => {
  const navigate = useNavigate();

  const {} = useQuery(["signIn"], () => AuthService.signUp());

  return (
    <AuthLayout>
      <Form className={s.form}>
        <Input placeholder="Login" />
        <Input placeholder="Password" />
        <Input placeholder="Repeat password" />
        <Button variant="contained" type="submit">
          Sign Up
        </Button>
        <Button variant="text" onClick={() => navigate("/signin")}>
          Sign In
        </Button>
      </Form>
    </AuthLayout>
  );
};
