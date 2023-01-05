import { MenuItem } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { GetAllBundlesPath } from "../../../../../../../../shared/endpoints/bundles/getAllBundles";
import { GetAllCarsPath } from "../../../../../../../../shared/endpoints/cars/getAllCars";
import { CreateConfigsPath } from "../../../../../../../../shared/endpoints/configs/createConfigs";
import { GetAllConfigsPath } from "../../../../../../../../shared/endpoints/configs/getAllConfigs";
import { Button } from "../../../../../../core/components/kit/Button/Button";
import { FileDropzone } from "../../../../../../core/components/kit/FIleDropzone/FileDropzone";
import { Form } from "../../../../../../core/components/kit/Form/Form";
import { FormActions } from "../../../../../../core/components/kit/Form/FormActions/FormActions";
import { Input } from "../../../../../../core/components/kit/Input/Input";
import { Textarea } from "../../../../../../core/components/kit/Textarea/Textarea";
import { createConfig, getBundles, getCars } from "../../../../../../core/services/main.service";
import { queryClient } from "../../../../../../main";

export const CreateForm = () => {
  const [title, setTitle] = useState<string>("");
  const [data, setData] = useState<string>("");
  const [bundleId, setBundleId] = useState<string>("");
  const [carId, setCarId] = useState<string>("");

  const { mutate } = useMutation([CreateConfigsPath], createConfig, {
    onSuccess: () => {
      queryClient.invalidateQueries([GetAllConfigsPath]);
    },
  });

  const { data: carsData } = useQuery([GetAllCarsPath], getCars);
  const { data: bundlesData } = useQuery([GetAllBundlesPath], getBundles);

  return (
    <Form>
      <Input inputLabel={"Config Title"} onChange={(event) => setTitle(event.target.value)} />

      <Textarea maxRows={15} value={data} disabled />
      <FileDropzone
        onChange={async (files) => {
          const file = await files[0].text();
          setData(file);
        }}
        accept={{ "application/json": [".json"] }}
        label="Click or place json file here"
        key={'test'}
      />
      <Input select inputLabel={"Car"} onChange={(event) => setCarId(event.target.value)} value={carId}>
        {carsData?.data.cars.map((car) => (
          <MenuItem key={car.id} value={car.id}>
            {car.name}
          </MenuItem>
        ))}
      </Input>
      <Input select inputLabel={"Bundle"} onChange={(event) => setBundleId(event.target.value)} value={bundleId}>
        {bundlesData?.data.bundles.map((car) => (
          <MenuItem key={car.id} value={car.id}>
            {car.name}
          </MenuItem>
        ))}
      </Input>
      <FormActions>
        <Button onClick={() => mutate({ bundleId, carId, data, title })}>Submit</Button>
      </FormActions>
    </Form>
  );
};
