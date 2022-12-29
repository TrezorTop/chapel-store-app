import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { GetAllConfigsPath } from "../../../../../../../shared/endpoints/configs/getAllConfigs";
import { Button } from "../../../../../core/components/kit/Button/Button";
import { Modal } from "../../../../../core/components/kit/Modal/Modal";
import { getConfigs } from "../../../../../core/services/main.service";
import { queryClient } from "../../../../../main";
import { Header } from "../../../components/EditHeader/EditHeader";
import { ItemCard } from "../../../components/ItemCard/ItemCard";
import { CreateForm } from "./CreateForm/CreateForm";

export const Configs = () => {
  const [modal, setModal] = useState<boolean>(false);

  const { data: configsData } = useQuery([GetAllConfigsPath], () => getConfigs({}));

  const {} = useMutation(["DeleteConfig"], () => deleteConfig, {
    onSuccess: () => {
      queryClient.invalidateQueries(["DeleteConfig"]);
    },
  });

  return (
    <>
      <Modal open={modal} onClose={() => setModal(false)}>
        <CreateForm />
      </Modal>

      <Header>
        <Button onClick={() => setModal(true)}>Add</Button>
      </Header>
      {configsData?.data.configs.map((config) => (
        <ItemCard
          actions={
            <>
              <Button variant="text">Update</Button>
              {/* <Button onClick={() => mutateDeleteCar({ id: config.id })} variant="text">
                Delete
              </Button> */}
            </>
          }
          key={config.id}
        >
          {config.title}
        </ItemCard>
      ))}
    </>
  );
};
