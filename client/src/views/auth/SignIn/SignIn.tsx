import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { LoginPath } from "../../../../../shared/endpoints/auth/login";
import { Form } from "../../../core/components/kit/Form/Form";
import { Button } from "../../../core/components/kit/Button/Button";
import { Input } from "../../../core/components/kit/Input/Input";
import { signIn } from "../../../core/services/user.service";
import { MAIN_URL, SIGN_UP_URL, USER_ACCESS_TOKEN_KEY } from "../../../core/utils/consts";
import { updateAuthTokens } from "../../../core/utils/functions/auth";
import { useForm } from "../../../core/utils/hooks/useForm";
import { Window } from "../components/Window/Window";
import s from "./SignIn.module.scss";

type TForm = {
  username: string;
  password: string;
};

export const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { form, updateForm } = useForm<TForm>();

  const { isLoading, mutate } = useMutation([LoginPath], signIn, {
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
        <Button variant="text" onClick={() => navigate(`../${SIGN_UP_URL}`)}>
          Sign Up
        </Button>
        {localStorage.getItem(USER_ACCESS_TOKEN_KEY) && (
          <Button variant="text" onClick={() => navigate(MAIN_URL)}>
            Proceed as User
          </Button>
        )}
      </Form>
    </Window>
  );
};
