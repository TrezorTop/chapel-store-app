import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router";

import {
  DeleteByIdConfigsParams,
  DeleteByIdConfigsPath,
} from "../../../../../../../shared/endpoints/configs/deleteByIdConfigs";
import { GetAllConfigsPath } from "../../../../../../../shared/endpoints/configs/getAllConfigs";
import { Button } from "../../../../../core/components/kit/Button/Button";
import { Modal } from "../../../../../core/components/kit/Modal/Modal";
import { deleteConfig, getConfigs } from "../../../../../core/services/main.service";
import { queryClient } from "../../../../../main";
import { Header } from "../../../components/EditHeader/EditHeader";
import { ItemCard } from "../../../components/ItemCard/ItemCard";
import { CreateForm } from "./CreateForm/CreateForm";

export const Configs = () => {
  const [modal, setModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const { data: configsData } = useQuery([GetAllConfigsPath], () => getConfigs({}));

  const { mutate: mutateDeleteConfig } = useMutation(
    [DeleteByIdConfigsPath],
    ({ id }: DeleteByIdConfigsParams) => deleteConfig({ id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GetAllConfigsPath]);
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

      {configsData?.data.configs.map((config) => (
        <ItemCard
          actions={
            <>
              <Button variant="text" onClick={() => navigate(`${config.id}/edit`)}>
                Update
              </Button>
              <Button onClick={() => mutateDeleteConfig({ id: config.id })} variant="text">
                Delete
              </Button>
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
