import { MenuItem } from "@mui/material";
import { useEffect, useState } from "react";

import { Button } from "../../../../core/components/kit/Button/Button";
import { Input } from "../../../../core/components/kit/Input/Input";
import {
  useBundles,
  useCars,
  useConfig,
} from "../../../../core/services/store.service";
import s from "./Selector.module.scss";

export const Selector = () => {
  const [carId, setCarId] = useState<string>("");
  const [bundleId, setBundleId] = useState<string>("");

  useEffect(() => {
    getCars();
  }, []);

  const { mutate: getCars, data: carsData } = useCars();
  const { mutate: getBundles, data: bundlesData } = useBundles();
  const { mutate: getConfig, data: configData } = useConfig();

  return (
    <div className={s.root}>
      <pre>{JSON.stringify(configData?.data)}</pre>
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
        onChange={(event) => setBundleId(event.target.value)}
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

      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={() => getConfig({ carId, bundleId })}
      >
        Proceed Payment
      </Button>
    </div>
  );
};
