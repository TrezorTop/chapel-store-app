import { Autocomplete, MenuItem } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { GetAllBundlesPath } from "../../../../../../../../shared/endpoints/bundles/getAllBundles";
import { GetByIdBundlesPath } from "../../../../../../../../shared/endpoints/bundles/getByIdBundles";
import {
  UpdateBundlesPath,
  UpdateBundlesRequestValidator,
} from "../../../../../../../../shared/endpoints/bundles/updateBundles";
import { GetAllCarsPath } from "../../../../../../../../shared/endpoints/cars/getAllCars";
import { GetAllConfigsPath } from "../../../../../../../../shared/endpoints/configs/getAllConfigs";
import { Button } from "../../../../../../core/components/kit/Button/Button";
import { Form } from "../../../../../../core/components/kit/Form/Form";
import { FormActions } from "../../../../../../core/components/kit/Form/FormActions/FormActions";
import { Input } from "../../../../../../core/components/kit/Input/Input";
import { Paper } from "../../../../../../core/components/kit/Paper/Paper";
import { getBundle, getCars, getSetups, updateBundle } from "../../../../../../core/services/main.service";
import { useForm } from "../../../../../../core/utils/hooks/useForm";
import { queryClient } from "../../../../../../main";

type TForm = {
  name: string;
  price: number;
  carId: string;
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

  const { data: carsData } = useQuery([GetAllCarsPath], getCars);

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
        <Autocomplete
          value={form.carId}
          disabled={true}
          onChange={(event, value) => {
            updateForm({ carId: value ?? "" });
          }}
          options={carsData?.data.cars.map((car) => car.id) ?? []}
          getOptionLabel={(option) => carsData?.data.cars.find((car) => car.id === option)?.name ?? ""}
          renderInput={(params) => <Input {...params} fullWidth value={form.carId} inputLabel="Car" />}
        />
        <Autocomplete
          value={form.setups}
          multiple
          disableCloseOnSelect
          onChange={(event, value) => {
            updateForm({ setups: value });
          }}
          options={setupsData?.data.configs.map((bundle) => bundle.id) ?? []}
          getOptionLabel={(option) => setupsData?.data.configs.find((setup) => setup.id === option)?.title ?? ""}
          renderInput={(params) => <Input {...params} fullWidth value={form.setups} inputLabel="Setups" />}
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
