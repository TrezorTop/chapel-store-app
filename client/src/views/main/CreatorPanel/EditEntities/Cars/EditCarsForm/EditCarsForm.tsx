import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";

import { GetAllCarsPath } from "../../../../../../../../shared/endpoints/cars/getAllCars";
import { GetByIdCarsPath } from "../../../../../../../../shared/endpoints/cars/getByIdCars";
import { UpdateCarsPath, UpdateCarsRequestValidator } from "../../../../../../../../shared/endpoints/cars/updateCars";
import { Button } from "../../../../../../core/components/kit/Button/Button";
import { Form } from "../../../../../../core/components/kit/Form/Form";
import { FormActions } from "../../../../../../core/components/kit/Form/FormActions/FormActions";
import { Input } from "../../../../../../core/components/kit/Input/Input";
import { Paper } from "../../../../../../core/components/kit/Paper/Paper";
import { getCar, updateCar } from "../../../../../../core/services/main.service";
import { useForm } from "../../../../../../core/utils/hooks/useForm";
import { queryClient } from "../../../../../../main";

type TForm = {
  name: string;
};

export const EditCarsForm = () => {
  const { form, updateForm, isFieldValid } = useForm<TForm>({ name: "" });

  const { id } = useParams<{ id: string }>();

  const { refetch } = useQuery([GetByIdCarsPath], () => getCar({ id: id ?? "" }), {
    onSuccess: ({ data }) => updateForm({ name: data.car.name }),
  });

  useEffect(() => {
    refetch();
  }, [id]);

  const { mutate, isLoading } = useMutation([UpdateCarsPath], () => updateCar({ id: id ?? "", name: form.name }), {
    onSuccess: () => {
      queryClient.invalidateQueries([GetAllCarsPath]);
    },
  });

  const isValid = useCallback(() => {
    return (
      !isLoading &&
      UpdateCarsRequestValidator?.name?.check &&
      isFieldValid(UpdateCarsRequestValidator.name.check, form.name)
    );
  }, [form, isLoading]);

  return (
    <Paper>
      <Form>
        <Input
          value={form.name}
          inputLabel={"Car Name"}
          onChange={(event) => updateForm({ name: event.target.value })}
        />
        <FormActions>
          <Button disabled={!isValid()} onClick={() => mutate()}>
            Update
          </Button>
        </FormActions>
      </Form>
    </Paper>
  );
};
