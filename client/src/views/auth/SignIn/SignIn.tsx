import { Button, TextField } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

import { AuthLayout } from "../../../core/components/hoc/AuthLayout/AuthLayout";
import { Form } from "../../../core/components/hoc/Form/Form";
import s from "./SignIn.module.scss";

export const SignIn = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <Form className={s.form}>
        <TextField variant="standard" placeholder="Login" />
        <TextField variant="standard" type="password" placeholder="Password" />
        <Button variant="contained" type="submit">
          Sign In
        </Button>
        <Button variant="text" onClick={() => navigate("/signup")}>
          Sign Up
        </Button>
      </Form>
    </AuthLayout>
  );
};
