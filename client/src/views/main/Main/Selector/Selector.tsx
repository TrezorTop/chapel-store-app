import { MenuItem } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { FC, useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { GetAllBundlesPath } from "../../../../../../shared/endpoints/bundles/getAllBundles";
import { GetAllCarsPath } from "../../../../../../shared/endpoints/cars/getAllCars";
import { Button } from "../../../../core/components/kit/Button/Button";
import { Form } from "../../../../core/components/kit/Form/Form";
import { Input } from "../../../../core/components/kit/Input/Input";
import { getBundles, getCars } from "../../../../core/services/main.service";
import { PAYMENT_URL } from "../../../../core/utils/consts/urls";
import { useForm } from "../../../../core/utils/hooks/useForm";

enum QueryParams {
  CarId = "carId",
  BundleId = "bundleId",
  ConfigId = "ConfigId",
}

type TForm = {
  carId: string;
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
  });

  const navigate = useNavigate();

  const { data: carsData } = useQuery([GetAllCarsPath], getCars);

  const { data: bundlesData, refetch: refetchBundles } = useQuery(
    [GetAllBundlesPath],
    () => getBundles({ carId: form.carId }),
    {
      enabled: !!form.carId,
    },
  );

  useEffect(() => {
    setSearchParams({
      ...(form.carId && { [QueryParams.CarId]: form.carId }),
      ...(form.bundleId && { [QueryParams.BundleId]: form.bundleId }),
    });
  }, [form.carId, form.bundleId]);

  useEffect(() => {
    if (!form.carId) return;
    refetchBundles();
  }, [form.carId]);

  const isValid = useCallback(() => {
    return form.carId && form.bundleId;
  }, [form.bundleId, form.carId]);

  return (
    <Form>
      <Input
        value={form.carId}
        onChange={(event) => {
          updateForm({ carId: event.target.value, bundleId: "" });
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
        value={form.bundleId}
        onChange={(event) => {
          updateForm({ bundleId: event.target.value });
        }}
        disabled={!form.carId || !bundlesData}
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
  );
};
