import { MenuItem } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { FC, useEffect, useState } from "react";

import { ErrorResponse } from "../../../../../../shared/consts/error";
import { GetAllBundlesPath } from "../../../../../../shared/endpoints/bundles/getAllBundles";
import { GetAllCarsPath, GetAllCarsResponse } from "../../../../../../shared/endpoints/cars/getAllCars";
import { GetAllConfigsPath, GetAllConfigsResponse } from "../../../../../../shared/endpoints/configs/getAllConfigs";
import { Button } from "../../../../core/components/kit/Button/Button";
import { Input } from "../../../../core/components/kit/Input/Input";
import { api } from "../../../../core/config/api";
import { getBundles, getCars, getConfigs } from "../../../../core/services/main.service";
import { GetElementType } from "../../../../core/utils/types/utilityTypes";
import s from "./Selector.module.scss";

type SelectorProps = {
  setConfig: (data: GetElementType<GetAllConfigsResponse["configs"]> | undefined) => void;
};

export const Selector: FC<SelectorProps> = ({ setConfig }) => {
  const [carId, setCarId] = useState<string>("");
  const [bundleId, setBundleId] = useState<string>("");
  const [configId, setConfigId] = useState<string>("");

  const { data: carsData } = useQuery([GetAllCarsPath], getCars);

  const { data: bundlesData } = useQuery([GetAllBundlesPath], getBundles, {
    enabled: !!carId,
  });

  const { data: configsData } = useQuery([GetAllConfigsPath], () => getConfigs({ bundleId, carId }), {
    enabled: !!bundleId,
  });

  return (
    <div className={s.root}>
      <Input
        value={carId}
        onChange={(event) => {
          setCarId(event.target.value);
        }}
        disabled={!carsData}
        inputLabel="Select Car"
        variant="outlined"
        fullWidth
        select
      >
        {carsData?.data.cars.map((car) => (
          <MenuItem key={car.id} value={car.id}>
            {car.name}
          </MenuItem>
        )) ?? []}
      </Input>

      <Input
        value={bundleId}
        onChange={(event) => {
          setBundleId(event.target.value);
        }}
        disabled={!carId && !bundlesData}
        inputLabel="Select Bundle"
        variant="outlined"
        fullWidth
        select
      >
        {bundlesData?.data.bundles.map((bundle) => (
          <MenuItem key={bundle.id} value={bundle.id}>
            {bundle.name}
          </MenuItem>
        )) ?? []}
      </Input>

      <Input
        value={configId}
        onChange={(event) => {
          setConfig(configsData?.data.configs.find((config) => config.id === event.target.value));
          setConfigId(event.target.value);
        }}
        disabled={!bundleId && !configsData}
        inputLabel="Select Config"
        variant="outlined"
        fullWidth
        select
      >
        {configsData?.data.configs.map((config) => (
          <MenuItem key={config.id} value={config.id}>
            {config.title}
          </MenuItem>
        )) ?? []}
      </Input>

      <Button variant="contained" size="large" fullWidth>
        Proceed Payment
      </Button>
    </div>
  );
};
