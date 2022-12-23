import { MenuItem } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { GetAllConfigResponse } from "../../../../../../shared/endpoints/configs/getAll";

import { Button } from "../../../../core/components/kit/Button/Button";
import { Input } from "../../../../core/components/kit/Input/Input";
import { useCreatePayment } from "../../../../core/services/payment.service";
import { useBundles, useCars, useConfigs } from "../../../../core/services/store.service";
import { GetElementType } from "../../../../core/utils/types/utilityTypes";
import s from "./Selector.module.scss";

type SelectorProps = {
  setConfig: (data: GetElementType<GetAllConfigResponse["configs"]> | undefined) => void;
};

export const Selector: FC<SelectorProps> = ({ setConfig }) => {
  const [carId, setCarId] = useState<string>("");
  const [bundleId, setBundleId] = useState<string>("");
  const [configId, setConfigId] = useState<string>("");

  useEffect(() => {
    getCars();
  }, []);

  const { mutate: getCars, data: carsData } = useCars();
  const { mutate: getBundles, data: bundlesData } = useBundles();
  const { mutate: getConfigs, data: configsData } = useConfigs();
  const { mutate: createPayment } = useCreatePayment();

  return (
    <div className={s.root}>
      <Input
        value={carId}
        onChange={(event) => {
          setCarId(event.target.value);
          !bundlesData && getBundles();
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
          getConfigs({ carId, bundleId: event.target.value });
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

      <Button variant="contained" size="large" fullWidth onClick={() => createPayment({ configId })}>
        Proceed Payment
      </Button>
    </div>
  );
};
