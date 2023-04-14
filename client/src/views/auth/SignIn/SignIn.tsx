import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ErrorResponse } from "../../../../../shared/consts/error";

import { LoginPath } from "../../../../../shared/endpoints/auth/login";
import { Button } from "../../../core/components/kit/Button/Button";
import { Form } from "../../../core/components/kit/Form/Form";
import { FormActions } from "../../../core/components/kit/Form/FormActions/FormActions";
import { Input } from "../../../core/components/kit/Input/Input";
import { Typography } from "../../../core/components/kit/Typography/Typography";
import { signIn } from "../../../core/services/user.service";
import { MAIN_URL, RESTORE_URL, SIGN_UP_URL, USER_REFRESH_TOKEN_KEY } from "../../../core/utils/consts/consts";
import { updateAuthTokens } from "../../../core/utils/functions/auth";
import { useForm } from "../../../core/utils/hooks/useForm";
import { Window } from "../components/Window/Window";

type TForm = {
  username: string;
  password: string;
};

export const SignIn = () => {
  const { form, updateForm, error, setError } = useForm<TForm>();

  const navigate = useNavigate();
  const location = useLocation();

  const referrer = (location.state as { referrer: string })?.referrer;

  const { isLoading, mutate } = useMutation([LoginPath], signIn, {
    onSuccess: ({ data }) => {
      updateAuthTokens(data.accessToken, data.refreshToken);
      navigate(referrer ?? MAIN_URL);
    },
    onError: ({ response }: AxiosError<ErrorResponse>) => {
      setError(response?.data.message);
    },
  });

  const isValid = useCallback(() => {
    return !isLoading && form.username?.length && form.password?.length;
  }, [form, isLoading]);

  return (
    <Window header="Authorization">
      <Form>
        <Input
          placeholder="Login or Email"
          onChange={(event) => updateForm({ username: event.target.value })}
          disabled={isLoading}
        />
        <Input
          type="password"
          placeholder="Password"
          onChange={(event) => updateForm({ password: event.target.value })}
          disabled={isLoading}
        />
        <FormActions variant="vertical">
          {error && (
            <Typography color="error" textAlign="center">
              {error}
            </Typography>
          )}
          <Button
            disabled={!isValid()}
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
          <Button variant="text" onClick={() => navigate(`../${RESTORE_URL}`)}>
            Restore
          </Button>

          {localStorage.getItem(USER_REFRESH_TOKEN_KEY) && (
            <Button variant="text" onClick={() => navigate(MAIN_URL)}>
              Proceed as User
            </Button>
          )}
        </FormActions>
      </Form>
    </Window>
  );
};
