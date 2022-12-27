import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";

import { ErrorResponse } from "../../../../../../../shared/consts/error";
import {
  DeleteByIdBundlesParams,
  DeleteByIdBundlesPath,
  DeleteByIdBundlesResponse,
} from "../../../../../../../shared/endpoints/bundles/deleteByIdBundles";
import { GetAllBundlesPath, GetAllBundlesResponse } from "../../../../../../../shared/endpoints/bundles/getAllBundles";
import { Button } from "../../../../../core/components/kit/Button/Button";
import { Input } from "../../../../../core/components/kit/Input/Input";
import { Modal } from "../../../../../core/components/kit/Modal/Modal";
import { Paper } from "../../../../../core/components/kit/Paper/Paper";
import { Typography } from "../../../../../core/components/kit/Typography/Typography";
import { api } from "../../../../../core/config/api";
import { ItemCard } from "../../../components/ItemCard/ItemCard";
import { Header } from "../../../components/EditHeader/EditHeader";

export const Bundles = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [errorModal, setErrorModal] = useState<boolean>(false);

  useEffect(() => {
    getBundles();
  }, []);

  const { data: bundlesData, mutate: getBundles } = useMutation<
    AxiosResponse<GetAllBundlesResponse>,
    AxiosError<ErrorResponse>
  >([GetAllBundlesPath], () => api.get(GetAllBundlesPath));

  const {
    data: deleteBundlesData,
    mutate: deleteBundle,
    error: deleteError,
  } = useMutation<AxiosResponse<DeleteByIdBundlesResponse>, AxiosError<DeleteByIdBundlesResponse>, DeleteByIdBundlesParams>(
    [DeleteByIdBundlesPath],
    ({ id }) => api.delete(DeleteByIdBundlesPath.replace(":id", id)),
    {
      onSuccess: () => {
        getBundles();
      },
      onError: ({ response }) => {
        if (response?.data.configs) {
          setErrorModal(true);
        }
      },
    },
  );

  return (
    <>
      <Modal open={modal} onClose={() => setModal(false)}>
        <Input />
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
      {bundlesData?.data.bundles.map((bundle) => (
        <ItemCard
          actions={
            <>
              <Button variant="text">Update</Button>
              <Button onClick={() => deleteBundle({ id: bundle.id })} variant="text">
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
