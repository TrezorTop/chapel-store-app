import { MenuItem } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { GetAllBundlesPath } from "../../../../../../../../shared/endpoints/bundles/getAllBundles";
import { GetAllCarsPath } from "../../../../../../../../shared/endpoints/cars/getAllCars";
import { CreateConfigsPath } from "../../../../../../../../shared/endpoints/configs/createConfigs";
import { GetAllConfigsPath } from "../../../../../../../../shared/endpoints/configs/getAllConfigs";
import { Button } from "../../../../../../core/components/kit/Button/Button";
import { Form } from "../../../../../../core/components/kit/Form/Form";
import { Input } from "../../../../../../core/components/kit/Input/Input";
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
      <Input inputLabel={"Bundle Title"} onChange={(event) => setTitle(event.target.value)} />
      <Input inputLabel={"JSON"} onChange={(event) => setData(event.target.value)} />
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
      <Button onClick={() => mutate({ bundleId, carId, data, title })}>Submit</Button>
    </Form>
  );
};
