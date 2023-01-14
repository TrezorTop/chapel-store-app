import { MenuItem } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { GetAllCarsPath } from "../../../../../../../../shared/endpoints/cars/getAllCars";
import { CreateConfigsPath } from "../../../../../../../../shared/endpoints/configs/createConfigs";
import { GetAllConfigsPath } from "../../../../../../../../shared/endpoints/configs/getAllConfigs";
import { Button } from "../../../../../../core/components/kit/Button/Button";
import { FileDropzone } from "../../../../../../core/components/kit/FIleDropzone/FileDropzone";
import { Form } from "../../../../../../core/components/kit/Form/Form";
import { FormActions } from "../../../../../../core/components/kit/Form/FormActions/FormActions";
import { Input } from "../../../../../../core/components/kit/Input/Input";
import { Paper } from "../../../../../../core/components/kit/Paper/Paper";
import { createSetup, getCars } from "../../../../../../core/services/main.service";
import { queryClient } from "../../../../../../main";

export const CreateForm = () => {
  const [title, setTitle] = useState<string>("");
  const [files, setFiles] = useState<File[]>();
  const [carId, setCarId] = useState<string>("");

  const { mutate } = useMutation([CreateConfigsPath], createSetup, {
    onSuccess: () => {
      queryClient.invalidateQueries([GetAllConfigsPath]);
    },
  });

  const { data: carsData } = useQuery([GetAllCarsPath], getCars);

  return (
    <Form>
      <Input inputLabel={"Setup Title"} onChange={(event) => setTitle(event.target.value)} />
      <FileDropzone
        onChange={(files) => {
          setFiles(files);
        }}
        label="Click or place json file here"
      />
      {files?.length && files.map((file, index) => <Paper key={index}>{file.name}</Paper>)}
      <Input select inputLabel={"Car"} onChange={(event) => setCarId(event.target.value)} value={carId}>
        {carsData?.data.cars.map((car) => (
          <MenuItem key={car.id} value={car.id}>
            {car.name}
          </MenuItem>
        ))}
      </Input>
      <FormActions>
        <Button
          onClick={() => {
            const formData = new FormData();

            formData.append("title", title);
            formData.append("carId", carId);

            files?.forEach((file) => formData.append("data", file, file.name));

            mutate(formData);
          }}
        >
          Submit
        </Button>
      </FormActions>
    </Form>
  );
};
