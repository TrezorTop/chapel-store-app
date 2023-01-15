import React from "react";
import { Button } from "../../../../core/components/kit/Button/Button";
import { FormActions } from "../../../../core/components/kit/Form/FormActions/FormActions";

import { Input } from "../../../../core/components/kit/Input/Input";
import { useForm } from "../../../../core/utils/hooks/useForm";

type TForm = {
  code: string;
  password: string;
  repeatedPassword: string;
};

export const Confirm = () => {
  const { form, updateForm } = useForm<TForm>();

  return (
    <>
      <Input placeholder="Code" onChange={(event) => updateForm({ code: event.target.value })} />
      <Input placeholder="Password" onChange={(event) => updateForm({ password: event.target.value })} />
      <Input placeholder="Repeat Password" onChange={(event) => updateForm({ repeatedPassword: event.target.value })} />
      <FormActions variant="vertical">
        <Button>Reset Password</Button>
      </FormActions>
    </>
  );
};
