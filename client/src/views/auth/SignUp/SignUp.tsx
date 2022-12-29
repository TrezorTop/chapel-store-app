import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { RegisterPath } from "../../../../../shared/endpoints/auth/register";
import { Form } from "../../../core/components/kit/Form/Form";
import { Button } from "../../../core/components/kit/Button/Button";
import { Input } from "../../../core/components/kit/Input/Input";
import { signUp } from "../../../core/services/user.service";
import { MAIN_URL, SIGN_IN_URL } from "../../../core/utils/consts";
import { updateAuthTokens } from "../../../core/utils/functions/auth";
import { useForm } from "../../../core/utils/hooks/useForm";
import { Window } from "../components/Window/Window";
import s from "./SignUp.module.scss";

type TForm = {
  username: string;
  password: string;
  repeatedPassword: string;
};

export const SignUp = () => {
  const { form, updateForm } = useForm<TForm>();

  const navigate = useNavigate();

  const { isLoading, mutate } = useMutation([RegisterPath], signUp, {
    onSuccess: ({ data }) => {
      updateAuthTokens(data.accessToken, data.refreshToken);
      navigate(MAIN_URL);
    },
  });

  return (
    <Window>
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
        <Input
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
        <Button variant="text" onClick={() => navigate(`../${SIGN_IN_URL}`)}>
          Sign In
        </Button>
      </Form>
    </Window>
  );
};
