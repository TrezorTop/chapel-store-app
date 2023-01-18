import { Autocomplete } from "@mui/material";
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

  useEffect(() => {
    if (!form.bundleId) return;
    setSelectedBundle(form.bundleId);
  }, [form.bundleId]);

  const isValid = useCallback(() => {
    return form.carId && form.bundleId;
  }, [form]);

  return (
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
  );
};
