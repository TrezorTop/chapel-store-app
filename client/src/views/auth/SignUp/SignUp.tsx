import { Button, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthLayout } from "../../../core/components/hoc/AuthLayout/AuthLayout";
import { Form } from "../../../core/components/hoc/Form/Form";
import { AuthService } from "../../../core/services/Auth.service";
import s from "./SignUp.module.scss";

export const SignUp = () => {
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatedPassword, setRepeatedPassword] = useState<string>("");

  const navigate = useNavigate();

  const { mutate } = useMutation(["signIn"], () => AuthService.signUp({ username: login, password }));

  return (
    <AuthLayout>
      <Form className={s.form}>
        <TextField variant="standard" placeholder="Login" onChange={(event) => setLogin(event.target.value)} />
        <TextField variant="standard" type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
        <TextField variant="standard" type="password" placeholder="Repeat password" onChange={(event) => setRepeatedPassword(event.target.value)} />
        <Button disabled={password.length < 6 || password !== repeatedPassword} variant="contained" type="submit" onClick={() => mutate()}>
          Sign Up
        </Button>
        <Button variant="text" onClick={() => navigate("/signin")}>
          Sign In
        </Button>
      </Form>
    </AuthLayout>
  );
};
