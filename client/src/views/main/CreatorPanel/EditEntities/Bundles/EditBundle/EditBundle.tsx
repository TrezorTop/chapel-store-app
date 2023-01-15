import { MenuItem } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { GetAllBundlesPath } from "../../../../../../../../shared/endpoints/bundles/getAllBundles";
import { GetByIdBundlesPath } from "../../../../../../../../shared/endpoints/bundles/getByIdBundles";
import {
  UpdateBundlesPath,
  UpdateBundlesRequestValidator,
} from "../../../../../../../../shared/endpoints/bundles/updateBundles";
import { GetAllConfigsPath } from "../../../../../../../../shared/endpoints/configs/getAllConfigs";
import { Button } from "../../../../../../core/components/kit/Button/Button";
import { Form } from "../../../../../../core/components/kit/Form/Form";
import { FormActions } from "../../../../../../core/components/kit/Form/FormActions/FormActions";
import { Input } from "../../../../../../core/components/kit/Input/Input";
import { Paper } from "../../../../../../core/components/kit/Paper/Paper";
import { getBundle, getSetups, updateBundle } from "../../../../../../core/services/main.service";
import { useForm } from "../../../../../../core/utils/hooks/useForm";
import { queryClient } from "../../../../../../main";

type TForm = {
  name: string;
  price: number;
  setups: string[];
};

export const EditBundle = () => {
  const { form, updateForm, isFieldValid } = useForm<TForm>({ name: "", price: 0, setups: [] });

  const { id } = useParams<{ id: string }>();

  const { refetch } = useQuery([GetByIdBundlesPath], () => getBundle({ id: id ?? "" }), {
    onSuccess: ({ data }) => {
      updateForm({
        name: data.bundle.name,
        price: Number(data.bundle.price),
        setups: data.bundle.configs.map((config) => config.config.id),
      });
    },
  });

  useEffect(() => {
    refetch();
  }, [id]);

  const { data: setupsData } = useQuery([GetAllConfigsPath], getSetups);

  const { mutate, isLoading } = useMutation(
    [UpdateBundlesPath],
    () => updateBundle({ id: id ?? "", name: form.name, price: form.price, configs: form.setups }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GetAllBundlesPath]);
        queryClient.invalidateQueries([GetAllConfigsPath]);
      },
    },
  );

  const isValid = useCallback(() => {
    return (
      !isLoading &&
      UpdateBundlesRequestValidator?.name?.check &&
      isFieldValid(UpdateBundlesRequestValidator.name.check, form.name) &&
      UpdateBundlesRequestValidator?.price?.check &&
      isFieldValid(UpdateBundlesRequestValidator.price.check, String(form.price)) &&
      form.setups &&
      form.setups.length >= 1
    );
  }, [form, isLoading]);

  return (
    <Paper>
      <Form>
        <Input
          value={form.name}
          inputLabel={"Bundle Name"}
          onChange={(event) => updateForm({ name: event.target.value })}
        />
        <Input
          value={form.price}
          type="number"
          inputLabel={"Price"}
          onChange={(event) => updateForm({ price: +event.target.value })}
        />
        <Input
          select
          inputLabel={"Setups"}
          SelectProps={{
            value: form.setups,
            multiple: true,
            onChange: (event) => updateForm({ setups: event.target.value as string[] }),
          }}
        >
          {setupsData?.data.configs.map((setup) => (
            <MenuItem key={setup.id} value={setup.id}>
              {setup.title}
            </MenuItem>
          ))}
        </Input>
        <FormActions>
          <Button disabled={!isValid()} onClick={() => mutate()}>
            Update
          </Button>
        </FormActions>
      </Form>
    </Paper>
  );
};
