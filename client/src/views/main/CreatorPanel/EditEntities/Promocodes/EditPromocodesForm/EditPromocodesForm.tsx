import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";

import { CreatePromocodesRequestValidator } from "../../../../../../../../shared/endpoints/promocodes/createPromocodes";
import { GetAllPromocodesPath } from "../../../../../../../../shared/endpoints/promocodes/getAllPromocodes";
import { GetByIdPromocodesPath } from "../../../../../../../../shared/endpoints/promocodes/getByIdPromocodes";
import { UpdatePromocodesPath } from "../../../../../../../../shared/endpoints/promocodes/updatePromocodes";
import { Button } from "../../../../../../core/components/kit/Button/Button";
import { Form } from "../../../../../../core/components/kit/Form/Form";
import { FormActions } from "../../../../../../core/components/kit/Form/FormActions/FormActions";
import { Input } from "../../../../../../core/components/kit/Input/Input";
import { Paper } from "../../../../../../core/components/kit/Paper/Paper";
import { getPromocode, updatePromocode } from "../../../../../../core/services/main.service";
import { useForm } from "../../../../../../core/utils/hooks/useForm";
import { queryClient } from "../../../../../../main";

type TForm = {
  name: string;
  discountToUser: number;
  earnedStreamer: number;
};

export const EditPromocodesForm = () => {
  const { form, updateForm, isFieldValid } = useForm<TForm>({ name: "", discountToUser: 0, earnedStreamer: 0 });

  const { id } = useParams<{ id: string }>();

  const { refetch, data: promocodeData } = useQuery([GetByIdPromocodesPath], () => getPromocode({ name: id ?? "" }), {
    onSuccess: ({ data }) => {
      updateForm({
        name: data.promocode.name,
        discountToUser: Number(data.promocode.discountToUser),
        earnedStreamer: Number(data.promocode.earnedStreamer),
      });
    },
  });

  const { mutate, isLoading } = useMutation([UpdatePromocodesPath], updatePromocode, {
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

  useEffect(() => {
    refetch();
  }, [id]);

  return (
    <Paper>
      <Form>
        <Input disabled value={form.name} inputLabel={"Name"} onChange={(event) => updateForm({ name: event.target.value })} />

        <Input
          value={form.discountToUser}
          type="number"
          inputLabel={"Discount To User"}
          onChange={(event) => updateForm({ discountToUser: +event.target.value })}
        />

        <Input
          value={form.earnedStreamer}
          type="number"
          inputLabel={"Earning To Promocode"}
          onChange={(event) => updateForm({ earnedStreamer: +event.target.value })}
        />

        <FormActions>
          <Button
            disabled={!isValid()}
            onClick={() =>
              mutate({
                name: promocodeData?.data.promocode.name!,
                discountToUser: form.discountToUser!,
                earnedStreamer: form.earnedStreamer!,
              })
            }
          >
            Update
          </Button>
        </FormActions>
      </Form>
    </Paper>
  );
};
