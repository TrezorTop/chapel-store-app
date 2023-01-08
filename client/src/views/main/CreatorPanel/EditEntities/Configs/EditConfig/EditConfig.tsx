import { MenuItem } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { GetAllBundlesPath } from "../../../../../../../../shared/endpoints/bundles/getAllBundles";
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
import { getBundles, getCars, getConfig, updateConfig } from "../../../../../../core/services/main.service";
import { queryClient } from "../../../../../../main";

export const EditConfig = () => {
  const [title, setTitle] = useState<string>("");
  const [file, setFile] = useState<File>();
  const [bundleId, setBundleId] = useState<string>("");
  const [carId, setCarId] = useState<string>("");

  const { id } = useParams<{ id: string }>();

  const { data: getConfigData, refetch } = useQuery([GetByIdConfigsPath], () => getConfig({ id: id ?? "" }), {
    onSuccess: ({ data }) => {
      setTitle(data.config.title);
      setBundleId(data.config.bundleId);
      setCarId(data.config.carId);
    },
  });

  useEffect(() => {
    refetch();
  }, [id]);

  const { data: carsData } = useQuery([GetAllCarsPath], getCars);
  const { data: bundlesData } = useQuery([GetAllBundlesPath], getBundles);

  const { mutate } = useMutation(
    [UpdateConfigsPath],
    async () =>
      updateConfig({ id: id ?? "", title, ...(file && { data: JSON.parse(await file?.text()) }), bundleId, carId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GetAllConfigsPath]);
      },
    },
  );

  return (
    <Paper>
      <Form>
        <Input value={title} inputLabel={"Config Title"} onChange={(event) => setTitle(event.target.value)} />
        <FileDropzone
          onChange={(files) => {
            const file = files[0];
            setFile(file);
          }}
          accept={{ "application/json": [".json"] }}
          label="Click or place json file here"
        />
        {file && <Paper>{file?.name}</Paper>}
        <Input value={carId} select inputLabel={"Car"} onChange={(event) => setCarId(event.target.value)}>
          {carsData?.data.cars.map((car) => (
            <MenuItem key={car.id} value={car.id}>
              {car.name}
            </MenuItem>
          ))}
        </Input>
        <Input value={bundleId} select inputLabel={"Bundle"} onChange={(event) => setBundleId(event.target.value)}>
          {bundlesData?.data.bundles.map((car) => (
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
