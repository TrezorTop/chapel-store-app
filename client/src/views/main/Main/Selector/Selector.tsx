import { Autocomplete, Box, Switch } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { FC, useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { BundleTypeEnum } from "../../../../../../shared/endpoints/bundles/createBundles";
import { GetAllBundlesPath } from "../../../../../../shared/endpoints/bundles/getAllBundles";
import { GetAllCarsPath } from "../../../../../../shared/endpoints/cars/getAllCars";
import { Button } from "../../../../core/components/kit/Button/Button";
import { Form } from "../../../../core/components/kit/Form/Form";
import { Input } from "../../../../core/components/kit/Input/Input";
import { Typography } from "../../../../core/components/kit/Typography/Typography";
import { getBundles, getCars } from "../../../../core/services/main.service";
import { PAYMENT_URL } from "../../../../core/utils/consts/consts";
import { useForm } from "../../../../core/utils/hooks/useForm";

import s from "./Selector.module.scss";

enum QueryParams {
  CarId = "carId",
  BundleId = "bundleId",
  ConfigId = "configId",
  Type = "type",
}

type TForm = {
  carId: string;
  type: BundleTypeEnum;
  bundleId: string;
};

type SelectorProps = {
  setSelectedBundle: (data: string) => void;
};

export const Selector: FC<SelectorProps> = ({ setSelectedBundle }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { form, updateForm, isFieldValid } = useForm<TForm>({
    carId: searchParams.get(QueryParams.CarId) ?? "",
    bundleId: searchParams.get(QueryParams.BundleId) ?? "",
    type: (searchParams.get(QueryParams.Type) as BundleTypeEnum) ?? BundleTypeEnum.FULLSET,
  });

  const navigate = useNavigate();

  const { data: carsData } = useQuery([GetAllCarsPath], getCars);

  const { data: bundlesData, refetch: refetchBundles } = useQuery(
    [GetAllBundlesPath],
    () => getBundles({ carId: form.carId, type: form.type, role: "USER" }),
    {
      enabled: !!form.carId,
    },
  );

  useEffect(() => {
    setSearchParams({
      ...(form.carId && { [QueryParams.CarId]: form.carId }),
      ...(form.bundleId && { [QueryParams.BundleId]: form.bundleId }),
      ...(form.type && { [QueryParams.Type]: form.type }),
    });
  }, [form]);

  useEffect(() => {
    if (!form.carId || !form.type) return;
    refetchBundles();
  }, [form.carId, form.type]);

  useEffect(() => {
    if (!form.bundleId) return;
    setSelectedBundle(form.bundleId);
  }, [form.bundleId]);

  const isValid = useCallback(() => {
    return form.carId && form.bundleId && form.type;
  }, [form]);

  return (
    <div>
      <Form>
        <Autocomplete
          value={form.carId}
          disabled={!carsData}
          onChange={(event, value) => {
            updateForm({ carId: value ?? "" });
          }}
          options={carsData?.data.cars.map((car) => car.id) ?? []}
          getOptionLabel={(option) => carsData?.data.cars.find((car) => car.id === option)?.name ?? ""}
          renderInput={(params) => <Input {...params} fullWidth value={form.carId} inputLabel="Select Car" />}
        />

        <Box display="flex" alignItems="center">
          <Typography color={form.type === BundleTypeEnum.SINGLE ? "primary" : undefined}>Single Track</Typography>{" "}
          <Switch
            onChange={(event) => {
              updateForm({ type: event.target.checked ? BundleTypeEnum.FULLSET : BundleTypeEnum.SINGLE, bundleId: "" });
            }}
            defaultChecked={form.type === BundleTypeEnum.FULLSET}
          />{" "}
          <Typography color={form.type === BundleTypeEnum.FULLSET ? "primary" : undefined}>Multiple track</Typography>
        </Box>

        <Autocomplete
          value={form.bundleId}
          disabled={!form.carId || !bundlesData}
          onChange={(event, value) => {
            updateForm({ bundleId: value ?? "" });
          }}
          options={bundlesData?.data.bundles.map((bundle) => bundle.id) ?? []}
          getOptionLabel={(option) => bundlesData?.data.bundles.find((bundle) => bundle.id === option)?.name ?? ""}
          renderInput={(params) => <Input {...params} fullWidth value={form.bundleId} inputLabel="Select Bundle" />}
        />

        <Button
          disabled={!isValid()}
          variant="outlined"
          color="success"
          size="large"
          fullWidth
          onClick={() => navigate(`../${PAYMENT_URL}/${form.bundleId}`)}
        >
          Proceed Payment
        </Button>
      </Form>

      <Typography variant="h6" marginTop>
        Need advice or have questions?
      </Typography>
      <Typography variant="h6">
        Get help on the{" "}
        <a className={s.link} href="https://discord.gg/AzvqMC9tgq" target='_blank'>
          Discord server
        </a>
      </Typography>
    </div>
  );
};
