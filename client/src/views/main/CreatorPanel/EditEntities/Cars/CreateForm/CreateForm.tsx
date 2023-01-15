import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { CreateCarsPath, CreateCarsRequestValidator } from "../../../../../../../../shared/endpoints/cars/createCars";
import { GetAllCarsPath } from "../../../../../../../../shared/endpoints/cars/getAllCars";
import { Button } from "../../../../../../core/components/kit/Button/Button";
import { Form } from "../../../../../../core/components/kit/Form/Form";
import { FormActions } from "../../../../../../core/components/kit/Form/FormActions/FormActions";
import { Input } from "../../../../../../core/components/kit/Input/Input";
import { createCar } from "../../../../../../core/services/main.service";
import { useForm } from "../../../../../../core/utils/hooks/useForm";
import { queryClient } from "../../../../../../main";

type TForm = {
  name: string;
};

export const CreateForm = () => {
  const { form, updateForm, isFieldValid } = useForm<TForm>({ name: "" });

  const { mutate, isLoading } = useMutation([CreateCarsPath], createCar, {
    onSuccess: () => {
      queryClient.invalidateQueries([GetAllCarsPath]);
    },
  });

  const isValid = useCallback(() => {
    return !isLoading && isFieldValid(CreateCarsRequestValidator.name.check, form.name);
  }, [form.name, isLoading]);

  return (
    <Form>
      <Input inputLabel={"Car Name"} onChange={(event) => updateForm({ name: event.target.value })} />
      <FormActions>
        <Button disabled={!isValid()} onClick={() => mutate({ name: form.name! })}>
          Submit
        </Button>
      </FormActions>
    </Form>
  );
};
