import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { Link } from "react-router-dom";

import {
  DeleteByIdConfigsParams,
  DeleteByIdConfigsPath,
} from "../../../../../../../shared/endpoints/configs/deleteByIdConfigs";
import { GetAllConfigsPath } from "../../../../../../../shared/endpoints/configs/getAllConfigs";
import { UpdateConfigsParams, UpdateConfigsPath } from "../../../../../../../shared/endpoints/configs/updateConfigs";
import { Button } from "../../../../../core/components/kit/Button/Button";
import { Modal } from "../../../../../core/components/kit/Modal/Modal";
import { Typography } from "../../../../../core/components/kit/Typography/Typography";
import { deleteSetup, getSetups, updateSetup } from "../../../../../core/services/main.service";
import { EDIT_ENTITIES_BUNDLES_URL } from "../../../../../core/utils/consts/urls";
import { queryClient } from "../../../../../main";
import { Header } from "../../../components/EditHeader/EditHeader";
import { ItemCard } from "../../../components/ItemCard/ItemCard";
import { CreateForm } from "./CreateForm/CreateForm";

export const Setups = () => {
  const [modal, setModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const { data: configsData } = useQuery([GetAllConfigsPath], getSetups);

  const { mutate: mutateDeleteConfig } = useMutation(
    [DeleteByIdConfigsPath],
    ({ id }: DeleteByIdConfigsParams) => deleteSetup({ id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GetAllConfigsPath]);
      },
    },
  );

  const { mutate: mutateUpdateConfig } = useMutation(
    [UpdateConfigsPath],
    ({ id }: UpdateConfigsParams) => {
      const formData = new FormData();

      formData.append("softDeleted", "false");

      return updateSetup({ id: id ?? "" }, formData);
    },
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
        <Typography variant="h4">Setups</Typography>
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
              {config.softDeleted ? (
                <Button color="warning" variant="text" onClick={() => mutateUpdateConfig({ id: config.id })}>
                  Restore
                </Button>
              ) : (
                <Button color="error" onClick={() => mutateDeleteConfig({ id: config.id })} variant="text">
                  Delete
                </Button>
              )}
            </>
          }
          key={config.id}
        >
          {config.title}
          {!!config.bundles.length && (
            <Typography variant="subtitle2">
              Linked with{" "}
              {config.bundles.map(({ bundle }) => (
                <React.Fragment key={bundle.id}>
                  <Link to={`../${EDIT_ENTITIES_BUNDLES_URL}/${bundle.id}/edit`}>{bundle.name}</Link>,{" "}
                </React.Fragment>
              ))}
            </Typography>
          )}
        </ItemCard>
      ))}
    </>
  );
};
