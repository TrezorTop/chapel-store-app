import { Autocomplete, CircularProgress, InputLabel } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { GetAllCarsPath } from "../../../../../../../../shared/endpoints/cars/getAllCars";
import {
  CreateConfigsPath,
  CreateConfigsRequestValidator,
} from "../../../../../../../../shared/endpoints/configs/createConfigs";
import { GetAllConfigsPath } from "../../../../../../../../shared/endpoints/configs/getAllConfigs";
import { Button } from "../../../../../../core/components/kit/Button/Button";
import { FileDropzone } from "../../../../../../core/components/kit/FIleDropzone/FileDropzone";
import { Form } from "../../../../../../core/components/kit/Form/Form";
import { FormActions } from "../../../../../../core/components/kit/Form/FormActions/FormActions";
import { Input } from "../../../../../../core/components/kit/Input/Input";
import { Paper } from "../../../../../../core/components/kit/Paper/Paper";
import { createSetup, getCars } from "../../../../../../core/services/main.service";
import { formatBytes } from "../../../../../../core/utils/functions/file";
import { useForm } from "../../../../../../core/utils/hooks/useForm";
import { queryClient } from "../../../../../../main";

type TForm = {
  title: string;
  files: File[];
  carId: string;
};

export const CreateForm = () => {
  const { form, updateForm, isFieldValid } = useForm<TForm>({ title: "", carId: "" });

  const { mutate, isLoading } = useMutation([CreateConfigsPath], createSetup, {
    onSuccess: () => {
      queryClient.invalidateQueries([GetAllConfigsPath]);
    },
  });

  const { data: carsData } = useQuery([GetAllCarsPath], getCars);

  const isValid = useCallback(() => {
    return (
      !isLoading &&
      isFieldValid(CreateConfigsRequestValidator.title.check, form.title) &&
      isFieldValid(CreateConfigsRequestValidator.carId.check, form.carId) &&
      form.files?.length
    );
  }, [form, isLoading]);

  return (
    <Form>
      <Input inputLabel={"Title"} onChange={(event) => updateForm({ title: event.target.value })} />
      <FileDropzone
        onChange={(files) => {
          updateForm({ files });
        }}
        label="Click or drag files here"
      />
      {form.files?.length && (
        <>
          <InputLabel>Uploaded Setup Files</InputLabel>
          {form.files.map((file, index) => (
            <Paper key={index}>
              {file.name} {formatBytes(file.size)}
            </Paper>
          ))}
        </>
      )}

      <Autocomplete
        value={form.carId}
        disabled={!carsData}
        onChange={(event, value) => {
          updateForm({ carId: value ?? "" });
        }}
        options={carsData?.data.cars.map((car) => car.id) ?? []}
        getOptionLabel={(option) => carsData?.data.cars.find((car) => car.id === option)?.name ?? ""}
        renderInput={(params) => <Input {...params} fullWidth value={form.carId} inputLabel="Car" />}
      />

      <FormActions>
        <Button
          disabled={!isValid()}
          onClick={() => {
            const formData = new FormData();

            formData.append("title", form.title!);
            formData.append("carId", form.carId!);

            form.files?.forEach((file) => formData.append("data", file, file.name));

            mutate(formData);
          }}
        >
          {isLoading ? <CircularProgress size={23} /> : <>Submit</>}
        </Button>
      </FormActions>
    </Form>
  );
};
