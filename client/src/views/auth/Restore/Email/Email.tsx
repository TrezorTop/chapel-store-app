import React, { FC } from "react";

import { Button } from "../../../../core/components/kit/Button/Button";
import { FormActions } from "../../../../core/components/kit/Form/FormActions/FormActions";
import { Input } from "../../../../core/components/kit/Input/Input";
import { useForm } from "../../../../core/utils/hooks/useForm";

type TForm = {
  email: string;
};

type TEmailProps = {
  onSubmit: () => void;
};

export const Email: FC<TEmailProps> = ({ onSubmit }) => {
  const { form, updateForm } = useForm<TForm>();

  return (
    <>
      <Input placeholder="Email" onChange={(event) => updateForm({ email: event.target.value })} />
      <FormActions variant="vertical">
        <Button onClick={() => onSubmit()}>Continue</Button>
      </FormActions>
    </>
  );
};
