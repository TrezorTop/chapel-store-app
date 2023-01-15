import { MenuItem } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import {
  CreateBundlesPath,
  CreateBundlesRequestValidator,
} from "../../../../../../../../shared/endpoints/bundles/createBundles";
import { GetAllBundlesPath } from "../../../../../../../../shared/endpoints/bundles/getAllBundles";
import { GetAllConfigsPath } from "../../../../../../../../shared/endpoints/configs/getAllConfigs";
import { Button } from "../../../../../../core/components/kit/Button/Button";
import { Form } from "../../../../../../core/components/kit/Form/Form";
import { FormActions } from "../../../../../../core/components/kit/Form/FormActions/FormActions";
import { Input } from "../../../../../../core/components/kit/Input/Input";
import { createBundle, getSetups } from "../../../../../../core/services/main.service";
import { useForm } from "../../../../../../core/utils/hooks/useForm";
import { queryClient } from "../../../../../../main";

type TForm = {
  name: string;
  price: number;
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
