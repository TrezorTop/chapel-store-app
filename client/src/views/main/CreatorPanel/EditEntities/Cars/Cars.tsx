import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";

import { ErrorResponse } from "../../../../../../../shared/consts/error";
import {
  DeleteByIdCarsParams,
  DeleteByIdCarsPath,
  DeleteByIdCarsResponse,
} from "../../../../../../../shared/endpoints/cars/deleteByIdCars";
import { GetAllCarsPath, GetAllCarsResponse } from "../../../../../../../shared/endpoints/cars/getAllCars";
import { Button } from "../../../../../core/components/kit/Button/Button";
import { Input } from "../../../../../core/components/kit/Input/Input";
import { Modal } from "../../../../../core/components/kit/Modal/Modal";
import { Paper } from "../../../../../core/components/kit/Paper/Paper";
import { Typography } from "../../../../../core/components/kit/Typography/Typography";
import { api } from "../../../../../core/config/api";
import { ItemCard } from "../../../components/ItemCard/ItemCard";
import { Header } from "../../../components/EditHeader/EditHeader";
import { EditForm } from "./EditForm/EditForm";

export const Cars = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [errorModal, setErrorModal] = useState<boolean>(false);

  useEffect(() => {
    getCars();
  }, []);

  const { data: carsData, mutate: getCars } = useMutation<AxiosResponse<GetAllCarsResponse>, AxiosError<ErrorResponse>>(
    [GetAllCarsPath],
    () => api.get(GetAllCarsPath),
  );

  const { mutate: deleteCar, error: deleteError } = useMutation<
    AxiosResponse<DeleteByIdCarsResponse>,
    AxiosError<DeleteByIdCarsResponse>,
    DeleteByIdCarsParams
  >([DeleteByIdCarsPath], ({ id }) => api.delete(DeleteByIdCarsPath.replace(":id", id)), {
    onSuccess: () => {
      getCars();
    },
    onError: ({ response }) => {
      if (response?.data.configs) {
        setErrorModal(true);
      }
    },
  });

  return (
    <>
      <Modal open={modal} onClose={() => setModal(false)}>
        <EditForm />
      </Modal>
      <Modal
        modalTitle={<Typography variant="h6">Delete these configs first</Typography>}
        open={errorModal}
        onClose={() => setErrorModal(false)}
      >
        <>
          {deleteError?.response?.data.configs?.map((config) => (
            <Paper key={config.id}>{config.title}</Paper>
          ))}
        </>
      </Modal>
      <Header>
        <Button onClick={() => setModal(true)}>Add</Button>
      </Header>
      {carsData?.data.cars.map((car) => (
        <ItemCard
          actions={
            <>
              <Button variant="text">Update</Button>
              <Button onClick={() => deleteCar({ id: car.id })} variant="text">
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
