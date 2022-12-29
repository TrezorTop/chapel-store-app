import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";

import { ErrorResponse } from "../../../../../../../shared/consts/error";
import { DeleteByIdBundlesPath } from "../../../../../../../shared/endpoints/bundles/deleteByIdBundles";
import { GetAllBundlesPath, GetAllBundlesResponse } from "../../../../../../../shared/endpoints/bundles/getAllBundles";
import { Button } from "../../../../../core/components/kit/Button/Button";
import { Modal } from "../../../../../core/components/kit/Modal/Modal";
import { api } from "../../../../../core/config/api";
import { deleteBundle } from "../../../../../core/services/main.service";
import { queryClient } from "../../../../../main";
import { Header } from "../../../components/EditHeader/EditHeader";
import { ItemCard } from "../../../components/ItemCard/ItemCard";
import { CreateForm } from "./CreateForm/CreateForm";

export const Bundles = () => {
  const [modal, setModal] = useState<boolean>(false);

  const { data: bundlesData } = useQuery<AxiosResponse<GetAllBundlesResponse>, AxiosError<ErrorResponse>>(
    [GetAllBundlesPath],
    () => api.get(GetAllBundlesPath),
  );

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
      {bundlesData?.data.bundles.map((bundle) => (
        <ItemCard
          actions={
            <>
              <Button variant="text">Update</Button>
              <Button onClick={() => mutateDeleteBundle({ id: bundle.id })} variant="text">
                Delete
              </Button>
            </>
          }
          key={bundle.id}
        >
          {bundle.name}
        </ItemCard>
      ))}
    </>
  );
};
