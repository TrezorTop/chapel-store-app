import { Autocomplete, MenuItem } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import {
  CreateBundlesPath,
  CreateBundlesRequestValidator,
} from "../../../../../../../../shared/endpoints/bundles/createBundles";
import { GetAllBundlesPath } from "../../../../../../../../shared/endpoints/bundles/getAllBundles";
import { GetAllCarsPath } from "../../../../../../../../shared/endpoints/cars/getAllCars";
import { GetAllConfigsPath } from "../../../../../../../../shared/endpoints/configs/getAllConfigs";
import { Button } from "../../../../../../core/components/kit/Button/Button";
import { Form } from "../../../../../../core/components/kit/Form/Form";
import { FormActions } from "../../../../../../core/components/kit/Form/FormActions/FormActions";
import { Input } from "../../../../../../core/components/kit/Input/Input";
import { createBundle, getCars, getSetups } from "../../../../../../core/services/main.service";
import { useForm } from "../../../../../../core/utils/hooks/useForm";
import { queryClient } from "../../../../../../main";

type TForm = {
  name: string;
  price: number;
  carId: string;
  setups: string[];
};

export const CreateForm = () => {
  const { form, updateForm, isFieldValid } = useForm<TForm>({ name: "", price: 0, setups: [] });

  const { mutate, isLoading } = useMutation([CreateBundlesPath], createBundle, {
    onSuccess: () => {
      queryClient.invalidateQueries([GetAllBundlesPath]);
    },
  });

  const { data: setupsData } = useQuery([GetAllConfigsPath], getSetups);

  const { data: carsData } = useQuery([GetAllCarsPath], getCars);

  const isValid = useCallback(() => {
    return (
      !isLoading &&
      isFieldValid(CreateBundlesRequestValidator.name.check, form.name) &&
      isFieldValid(CreateBundlesRequestValidator.price.check, String(form.price)) &&
      form.setups &&
      form.setups.length >= 1
    );
  }, [form, isLoading]);

  return (
    <Form>
      <Input inputLabel={"Bundle Name"} onChange={(event) => updateForm({ name: event.target.value })} />
      <Input type="number" inputLabel={"Price"} onChange={(event) => updateForm({ price: +event.target.value })} />

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
        <Button
          disabled={!isValid()}
          onClick={() => mutate({ name: form.name!, price: form.price!, configs: form.setups! })}
        >
          Submit
        </Button>
      </FormActions>
    </Form>
  );
};
