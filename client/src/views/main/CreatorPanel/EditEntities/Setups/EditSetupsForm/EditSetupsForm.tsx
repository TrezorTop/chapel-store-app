import { Autocomplete, CircularProgress, InputLabel } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { GetAllCarsPath } from "../../../../../../../../shared/endpoints/cars/getAllCars";
import { GetAllConfigsPath } from "../../../../../../../../shared/endpoints/configs/getAllConfigs";
import { GetByIdConfigsPath } from "../../../../../../../../shared/endpoints/configs/getById";
import {
  UpdateConfigsPath,
  UpdateConfigsRequestValidator,
} from "../../../../../../../../shared/endpoints/configs/updateConfigs";
import { Button } from "../../../../../../core/components/kit/Button/Button";
import { FileDropzone } from "../../../../../../core/components/kit/FIleDropzone/FileDropzone";
import { Form } from "../../../../../../core/components/kit/Form/Form";
import { FormActions } from "../../../../../../core/components/kit/Form/FormActions/FormActions";
import { Input } from "../../../../../../core/components/kit/Input/Input";
import { Paper } from "../../../../../../core/components/kit/Paper/Paper";
import { getCars, getSetupById, updateSetup } from "../../../../../../core/services/main.service";
import { formatBytes } from "../../../../../../core/utils/functions/file";
import { useForm } from "../../../../../../core/utils/hooks/useForm";
import { queryClient } from "../../../../../../main";

type TForm = {
  title: string;
  files: File[];
  carId: string;
};

export const EditSetupsForm = () => {
  const { form, updateForm, isFieldValid } = useForm<TForm>({ title: "", carId: "" });

  const { id } = useParams<{ id: string }>();

  const { data: setupData, refetch } = useQuery([GetByIdConfigsPath], () => getSetupById({ id: id ?? "" }), {
    onSuccess: ({ data }) => {
      updateForm({ title: data.config.title, carId: data.config.carId });
    },
  });

  useEffect(() => {
    refetch();
  }, [id]);

  const { data: carsData } = useQuery([GetAllCarsPath], getCars);

  const { mutate, isLoading } = useMutation(
    [UpdateConfigsPath],
    () => {
      const formData = new FormData();

      formData.append("title", form.title!);
      formData.append("carId", form.carId!);

      form.files?.forEach((file) => formData.append("data", file, file.name));

      return updateSetup({ id: id ?? "" }, formData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GetAllConfigsPath]);
        queryClient.invalidateQueries([GetByIdConfigsPath]);
      },
    },
  );

  const isValid = useCallback(() => {
    return (
      !isLoading &&
      UpdateConfigsRequestValidator?.title?.check &&
      isFieldValid(UpdateConfigsRequestValidator.title.check, form.title) &&
      UpdateConfigsRequestValidator?.carId?.check &&
      isFieldValid(UpdateConfigsRequestValidator.carId.check, form.carId) &&
      form.files?.length
    );
  }, [form, isLoading]);

  return (
    <Paper>
      <Form>
        <Input
          value={form.title}
          inputLabel={"Title"}
          onChange={(event) => updateForm({ title: event.target.value })}
        />
        <FileDropzone
          onChange={(files) => {
            updateForm({ files });
          }}
          label="Click or drag files here"
        />
        {form.files?.length && (
          <>
            <InputLabel>Uploaded Files</InputLabel>
            {form.files.map((file, index) => (
              <Paper key={index}>
                {file.name} {formatBytes(+file.size)}
              </Paper>
            ))}
          </>
        )}
        {setupData?.data.config?.files && (
          <>
            <InputLabel>Current Setup Files</InputLabel>
            {setupData?.data.config?.files.map((file, index) => (
              <Paper key={index}>
                {file.originalName} {formatBytes(+file.size)}
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
              mutate();
            }}
          >
            {isLoading ? <CircularProgress size={23} /> : <>Update</>}
          </Button>
        </FormActions>
      </Form>
    </Paper>
  );
};
