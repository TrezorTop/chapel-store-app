import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Route, Routes } from "react-router";

import { DeleteByIdCarsParams, DeleteByIdCarsPath } from "../../../../../../../shared/endpoints/cars/deleteByIdCars";
import { GetAllCarsPath } from "../../../../../../../shared/endpoints/cars/getAllCars";
import { Button } from "../../../../../core/components/kit/Button/Button";
import { Modal } from "../../../../../core/components/kit/Modal/Modal";
import { deleteCar, getCars } from "../../../../../core/services/main.service";
import { queryClient } from "../../../../../main";
import { Header } from "../../../components/EditHeader/EditHeader";
import { ItemCard } from "../../../components/ItemCard/ItemCard";
import { CreateForm } from "./CreateForm/CreateForm";

export const Cars = () => {
  const [modal, setModal] = useState<boolean>(false);

  const { data: carsData } = useQuery([GetAllCarsPath], getCars);

  const { error: deleteError, mutate: mutateDeleteCar } = useMutation(
    [DeleteByIdCarsPath],
    ({ id }: DeleteByIdCarsParams) => deleteCar({ id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GetAllCarsPath]);
      },
      onError: ({ response }) => {
        if (response?.data.configs) {
          // setErrorModal(true);
        }
      },
    },
  );

  return (
    <>
      <Modal open={modal} onClose={() => setModal(false)}>
        <CreateForm />
      </Modal>

      <Header>
        <Button onClick={() => setModal(true)}>Add</Button>
      </Header>
      {carsData?.data.cars.map((car) => (
        <ItemCard
          actions={
            <>
              <Button variant="text">Update</Button>
              <Button onClick={() => mutateDeleteCar({ id: car.id })} variant="text">
                Delete
              </Button>
            </>
          }
          key={car.id}
        >
          {car.name}
        </ItemCard>
      ))}
    </>
  );
};
