import { useMutation } from "@tanstack/react-query";
import React, { useCallback } from "react";

import {
  CreatePromocodesPath,
  CreatePromocodesRequestValidator,
} from "../../../../../../../../shared/endpoints/promocodes/createPromocodes";
import { GetAllPromocodesPath } from "../../../../../../../../shared/endpoints/promocodes/getAllPromocodes";
import { Button } from "../../../../../../core/components/kit/Button/Button";
import { Form } from "../../../../../../core/components/kit/Form/Form";
import { FormActions } from "../../../../../../core/components/kit/Form/FormActions/FormActions";
import { Input } from "../../../../../../core/components/kit/Input/Input";
import { createPromocode } from "../../../../../../core/services/main.service";
import { useForm } from "../../../../../../core/utils/hooks/useForm";
import { queryClient } from "../../../../../../main";

type TForm = {
  name: string;
  discountToUser: number;
  earnedStreamer: number;
};

export const CreateForm = () => {
  const { form, updateForm, isFieldValid } = useForm<TForm>({ name: "", discountToUser: 0, earnedStreamer: 0 });

  const { mutate, isLoading } = useMutation([CreatePromocodesPath], createPromocode, {
    onSuccess: () => {
      queryClient.invalidateQueries([GetAllPromocodesPath]);
    },
  });

  const isValid = useCallback(() => {
    return (
      !isLoading &&
      isFieldValid(CreatePromocodesRequestValidator.name.check, form.name) &&
      isFieldValid(CreatePromocodesRequestValidator.discountToUser.check, String(form.discountToUser)) &&
      isFieldValid(CreatePromocodesRequestValidator.earnedStreamer.check, String(form.earnedStreamer)) &&
      form.discountToUser &&
      form.earnedStreamer
    );
  }, [form, isLoading]);

  return (
    <Form>
      <Input inputLabel={"Name"} onChange={(event) => updateForm({ name: event.target.value })} />
      <Input
        type="number"
        inputLabel={"Discount To User"}
        onChange={(event) => updateForm({ discountToUser: +event.target.value })}
      />
      <Input
        type="number"
        inputLabel={"Earning To Promocode"}
        onChange={(event) => updateForm({ earnedStreamer: +event.target.value })}
      />

      <FormActions>
        <Button
          disabled={!isValid()}
          onClick={() =>
            mutate({ name: form.name!, discountToUser: form.discountToUser!, earnedStreamer: form.earnedStreamer! })
          }
        >
          Submit
        </Button>
      </FormActions>
    </Form>
  );
};
