import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { Link } from "react-router-dom";

import { DeleteByIdCarsParams, DeleteByIdCarsPath } from "../../../../../../../shared/endpoints/cars/deleteByIdCars";
import { GetAllCarsPath } from "../../../../../../../shared/endpoints/cars/getAllCars";
import { Button } from "../../../../../core/components/kit/Button/Button";
import { Modal } from "../../../../../core/components/kit/Modal/Modal";
import { Paper } from "../../../../../core/components/kit/Paper/Paper";
import { Typography } from "../../../../../core/components/kit/Typography/Typography";
import { deleteCar, getCars } from "../../../../../core/services/main.service";
import { queryClient } from "../../../../../main";
import { Header } from "../../../components/EditHeader/EditHeader";
import { ItemCard } from "../../../components/ItemCard/ItemCard";
import { CreateForm } from "./CreateForm/CreateForm";

export const Cars = () => {
  const [modal, setModal] = useState<boolean>(false);
  const navigate = useNavigate();

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

      <Outlet />

      {carsData?.data.cars.map((car) => (
        <ItemCard
          actions={
            <>
              <Button variant="text" onClick={() => navigate(`${car.id}/edit`)}>
                Update
              </Button>
              <Button onClick={() => mutateDeleteCar({ id: car.id })} variant="text">
                Delete
              </Button>
            </>
          }
          key={car.id}
        >
          {car.name}
          {!!car.configs.length && (
            <Typography variant="subtitle2">
              Linked with{" "}
              {car.configs.map((config) => (
                <React.Fragment key={config.id}>
                  <Link to={`../configs/${config.id}/edit`} >{config.title}</Link>,{" "}
                </React.Fragment>
              ))}
            </Typography>
          )}
        </ItemCard>
      ))}
    </>
  );
};
