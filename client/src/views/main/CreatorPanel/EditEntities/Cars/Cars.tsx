import React, { useEffect, useState } from "react";

import { Button } from "../../../../../core/components/kit/Button/Button";
import { Input } from "../../../../../core/components/kit/Input/Input";
import { Modal } from "../../../../../core/components/kit/Modal/Modal";
import { Paper } from "../../../../../core/components/kit/Paper/Paper";
import { useCars } from "../../../../../core/services/store.service";
import { Header } from "../Header/Header";

export const Cars = () => {
  const [modal, setModal] = useState<boolean>(false);

  const { data, mutate } = useCars().get;

  useEffect(() => {
    mutate();
  }, []);

  return (
    <>
      <Modal modalTitle={"test"} open={modal} onClose={() => setModal(false)}>
        <Input />
      </Modal>
      <Header>
        <Button onClick={() => setModal(true)}>Add</Button>
      </Header>
      {data?.data.cars.map((car) => (
        <Paper key={car.id}>
          <Button variant="text">Delete</Button> {car.name}
        </Paper>
      ))}
    </>
  );
};
