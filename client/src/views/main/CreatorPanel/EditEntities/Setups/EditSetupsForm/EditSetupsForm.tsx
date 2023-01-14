import { InputLabel, MenuItem } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { GetAllCarsPath } from "../../../../../../../../shared/endpoints/cars/getAllCars";
import { GetAllConfigsPath } from "../../../../../../../../shared/endpoints/configs/getAllConfigs";
import { GetByIdConfigsPath } from "../../../../../../../../shared/endpoints/configs/getById";
import { UpdateConfigsPath } from "../../../../../../../../shared/endpoints/configs/updateConfigs";
import { Button } from "../../../../../../core/components/kit/Button/Button";
import { FileDropzone } from "../../../../../../core/components/kit/FIleDropzone/FileDropzone";
import { Form } from "../../../../../../core/components/kit/Form/Form";
import { FormActions } from "../../../../../../core/components/kit/Form/FormActions/FormActions";
import { Input } from "../../../../../../core/components/kit/Input/Input";
import { Paper } from "../../../../../../core/components/kit/Paper/Paper";
import { getCars, getSetupById, updateSetup } from "../../../../../../core/services/main.service";
import { formatBytes } from "../../../../../../core/utils/functions/file";
import { queryClient } from "../../../../../../main";

export const EditSetupsForm = () => {
  const [title, setTitle] = useState<string>("");
  const [files, setFiles] = useState<File[]>();
  const [carId, setCarId] = useState<string>("");

  const { id } = useParams<{ id: string }>();

  const { data: setupData, refetch } = useQuery([GetByIdConfigsPath], () => getSetupById({ id: id ?? "" }), {
    onSuccess: ({ data }) => {
      setTitle(data.config.title);
      setCarId(data.config.carId);
    },
  });

  useEffect(() => {
    refetch();
  }, [id]);

  const { data: carsData } = useQuery([GetAllCarsPath], getCars);

  const { mutate } = useMutation(
    [UpdateConfigsPath],
    () => {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("carId", carId);

      files?.forEach((file) => formData.append("data", file, file.name));

      return updateSetup({ id: id ?? "" }, formData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GetAllConfigsPath]);
        queryClient.invalidateQueries([GetByIdConfigsPath]);
      },
    },
  );

  return (
    <Paper>
      <Form>
        {setupData?.data.config.files && (
          <>
            <InputLabel>Current Setup Files</InputLabel>
            {setupData?.data.config.files.map((file, index) => (
              <Paper key={index}>
                {file.originalName} {formatBytes(+file.size)}
              </Paper>
            ))}
          </>
        )}
        <Input value={title} inputLabel={"Setup Title"} onChange={(event) => setTitle(event.target.value)} />
        <FileDropzone
          onChange={(files) => {
            setFiles(files);
          }}
          label="Click or place json file here"
        />
        {files?.length && (
          <>
            <InputLabel>Uploaded Files</InputLabel>
            {files.map((file, index) => (
              <Paper key={index}>
                {file.name} {formatBytes(+file.size)}
              </Paper>
            ))}
          </>
        )}
        <Input value={carId} select inputLabel={"Car"} onChange={(event) => setCarId(event.target.value)}>
          {carsData?.data.cars.map((car) => (
            <MenuItem key={car.id} value={car.id}>
              {car.name}
            </MenuItem>
          ))}
        </Input>
        <FormActions>
          <Button
            onClick={() => {
              mutate();
            }}
          >
            Update
          </Button>
        </FormActions>
      </Form>
    </Paper>
  );
};
