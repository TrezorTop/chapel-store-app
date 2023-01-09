import { MenuItem } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { GetAllBundlesPath } from "../../../../../../shared/endpoints/bundles/getAllBundles";
import { GetAllCarsPath } from "../../../../../../shared/endpoints/cars/getAllCars";
import { GetAllConfigsPath } from "../../../../../../shared/endpoints/configs/getAllConfigs";
import { CreatePaymentPath } from "../../../../../../shared/endpoints/purchases/createPurchases";
import { Button } from "../../../../core/components/kit/Button/Button";
import { Input } from "../../../../core/components/kit/Input/Input";
import { getBundles, getCars, getConfigs } from "../../../../core/services/main.service";
import { createPayment } from "../../../../core/services/payment.service";
import { getMyConfigs } from "../../../../core/services/profile.service";
import { queryClient } from "../../../../main";
import s from "./Selector.module.scss";

enum QueryParams {
  CarId = "carId",
  BundleId = "bundleId",
  ConfigId = "ConfigId",
}

type SelectorProps = {
  setSelectedConfig: (data: string) => void;
};

export const Selector: FC<SelectorProps> = ({ setSelectedConfig }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [carId, setCarId] = useState<string>("");
  const [bundleId, setBundleId] = useState<string>("");
  const [configId, setConfigId] = useState<string>("");

  const { data: carsData } = useQuery([GetAllCarsPath], getCars);

  const { data: bundlesData } = useQuery([GetAllBundlesPath], getBundles, {
    enabled: !!carId,
  });

  const { data: configsData, refetch: refetchConfigs } = useQuery(
    [GetAllConfigsPath],
    () => getConfigs({ bundleId, carId }),
    {
      enabled: !!bundleId,
    },
  );

  const { mutate: mutateCreatePayment } = useMutation([CreatePaymentPath], () => createPayment({ configId }), {
    onSuccess: () => {
      queryClient.invalidateQueries([getMyConfigs]);
    },
  });

  useEffect(() => {
    setSearchParams({
      ...(carId && { [QueryParams.CarId]: carId }),
      ...(bundleId && { [QueryParams.BundleId]: bundleId }),
      ...(configId && { [QueryParams.ConfigId]: configId }),
    });

    const queryCarId = searchParams.get(QueryParams.CarId);
    const queryBundleId = searchParams.get(QueryParams.BundleId);
    const queryConfigId = searchParams.get(QueryParams.ConfigId);

    queryCarId && setCarId(queryCarId);
    queryBundleId && setBundleId(queryBundleId);
    if (queryConfigId) {
      setConfigId(queryConfigId);
      setSelectedConfig(queryConfigId);
    }
  }, []);

  useEffect(() => {
    setSearchParams({
      ...(carId && { [QueryParams.CarId]: carId }),
      ...(bundleId && { [QueryParams.BundleId]: bundleId }),
      ...(configId && { [QueryParams.ConfigId]: configId }),
    });
  }, [carId, bundleId, configId]);

  useEffect(() => {
    // carId && setBundleId("");
  }, [carId]);

  useEffect(() => {
    // setConfigId("");
    bundleId && refetchConfigs();
  }, [bundleId]);

  return (
    <div className={s.root}>
      <Input
        value={carId}
        onChange={(event) => {
          setBundleId("");
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
        disabled={!carId || !bundlesData}
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
          setSelectedConfig(event.target.value);
          setConfigId(event.target.value);
        }}
        disabled={!bundleId || !configsData}
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
      <Button variant="contained" size="large" fullWidth onClick={() => mutateCreatePayment()}>
        Proceed Payment
      </Button>
    </div>
  );
};
