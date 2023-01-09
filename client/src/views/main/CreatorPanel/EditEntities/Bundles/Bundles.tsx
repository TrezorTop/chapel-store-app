import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { Link } from "react-router-dom";

import { DeleteByIdBundlesPath } from "../../../../../../../shared/endpoints/bundles/deleteByIdBundles";
import { GetAllBundlesPath } from "../../../../../../../shared/endpoints/bundles/getAllBundles";
import { Button } from "../../../../../core/components/kit/Button/Button";
import { Modal } from "../../../../../core/components/kit/Modal/Modal";
import { Typography } from "../../../../../core/components/kit/Typography/Typography";
import { deleteBundle, getBundles } from "../../../../../core/services/main.service";
import { queryClient } from "../../../../../main";
import { Header } from "../../../components/EditHeader/EditHeader";
import { ItemCard } from "../../../components/ItemCard/ItemCard";
import { CreateForm } from "./CreateForm/CreateForm";

export const Bundles = () => {
  const [modal, setModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const { data: bundlesData } = useQuery([GetAllBundlesPath], () => getBundles());

  const { mutate: mutateDeleteBundle } = useMutation([DeleteByIdBundlesPath], deleteBundle, {
    onSuccess: () => {
      queryClient.invalidateQueries([GetAllBundlesPath]);
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

      <Outlet />

      {bundlesData?.data.bundles.map((bundle) => (
        <ItemCard
          key={bundle.id}
          actions={
            <>
              <Button variant="text" onClick={() => navigate(`${bundle.id}/edit`)}>
                Update
              </Button>

              <Button onClick={() => mutateDeleteBundle({ id: bundle.id })} variant="text">
                Delete
              </Button>
            </>
          }
        >
          {bundle.name}
          {!!bundle.configs.length && (
            <Typography variant="subtitle2">
              Linked with{" "}
              {bundle.configs.map((config) => (
                <React.Fragment key={config.id}>
                  <Link to={`../configs/${config.id}/edit`}>{config.title}</Link>,{" "}
                </React.Fragment>
              ))}
            </Typography>
          )}
        </ItemCard>
      ))}
    </>
  );
};
