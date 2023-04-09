import { Autocomplete } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";

import { DeleteByIdBundlesPath } from "../../../../../../../shared/endpoints/bundles/deleteByIdBundles";
import { GetAllBundlesPath } from "../../../../../../../shared/endpoints/bundles/getAllBundles";
import { UpdateBundlesPath } from "../../../../../../../shared/endpoints/bundles/updateBundles";
import { GetAllCarsPath } from "../../../../../../../shared/endpoints/cars/getAllCars";
import { Button } from "../../../../../core/components/kit/Button/Button";
import { Input } from "../../../../../core/components/kit/Input/Input";
import { Modal } from "../../../../../core/components/kit/Modal/Modal";
import { Typography } from "../../../../../core/components/kit/Typography/Typography";
import { deleteBundle, getBundles, getCars, updateBundle } from "../../../../../core/services/main.service";
import { useForm } from "../../../../../core/utils/hooks/useForm";
import { queryClient } from "../../../../../main";
import { Header } from "../../../components/EditHeader/EditHeader";
import { ItemCard } from "../../../components/ItemCard/ItemCard";
import { CreateForm } from "./CreateForm/CreateForm";

type TForm = {
  carId: string;
};

export const Bundles = () => {
  const { form, updateForm, isFieldValid } = useForm<TForm>();

  const [modal, setModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const { data: carsData } = useQuery([GetAllCarsPath], getCars);

  const { data: bundlesData, refetch: refetchMyBundles } = useQuery([GetAllBundlesPath], () =>
    getBundles({ role: "ADMIN", ...(form.carId && { carId: form.carId }) }),
  );

  const { mutate: mutateDeleteBundle } = useMutation([DeleteByIdBundlesPath], deleteBundle, {
    onSuccess: () => {
      queryClient.invalidateQueries([GetAllBundlesPath]);
    },
  });

  const { mutate: mutateUpdateBundle } = useMutation([UpdateBundlesPath], updateBundle, {
    onSuccess: () => {
      queryClient.invalidateQueries([GetAllBundlesPath]);
    },
  });

  useEffect(() => {
    refetchMyBundles();
  }, [form.carId]);

  return (
    <>
      <Modal open={modal} onClose={() => setModal(false)}>
        <CreateForm />
      </Modal>

      <Header>
        <Typography variant="h4">Bundles</Typography>
        <Button onClick={() => setModal(true)}>Add</Button>
      </Header>

      <Autocomplete
        onChange={(event, value) => {
          updateForm({ carId: value ?? "" });
        }}
        options={carsData?.data.cars.map((car) => car.id) ?? []}
        getOptionLabel={(option) => carsData?.data.cars.find((car) => car.id === option)?.name ?? ""}
        renderInput={(params) => <Input {...params} fullWidth inputLabel="Select Car" />}
      />

      <Outlet />

      {bundlesData?.data.bundles.map((bundle) => (
        <ItemCard
          entityId={bundle.id}
          entityName={bundle.name}
          key={bundle.id}
          actions={
            <>
              <Button variant="text" onClick={() => navigate(`${bundle.id}/edit`)}>
                Update
              </Button>

              {bundle.softDeleted ? (
                <Button
                  color="warning"
                  onClick={() => mutateUpdateBundle({ id: bundle.id, softDeleted: false })}
                  variant="text"
                >
                  Restore
                </Button>
              ) : (
                <Button color="error" onClick={() => mutateDeleteBundle({ id: bundle.id })} variant="text">
                  Delete
                </Button>
              )}
            </>
          }
        >
          <Typography color={bundle.softDeleted ? "error" : "inherit"}>{bundle.name}</Typography>{" "}
          {bundle.softDeleted && (
            <Typography variant="caption" color="error">
              Deleted
            </Typography>
          )}
        </ItemCard>
      ))}
    </>
  );
};
