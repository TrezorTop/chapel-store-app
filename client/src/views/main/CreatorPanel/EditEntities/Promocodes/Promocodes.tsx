import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { GetAllPromocodesPath } from "../../../../../../../shared/endpoints/promocodes/getAllPromocodes";
import {
  UpdatePromocodesParams,
  UpdatePromocodesPath,
} from "../../../../../../../shared/endpoints/promocodes/updatePromocodes";
import { Button } from "../../../../../core/components/kit/Button/Button";
import { Modal } from "../../../../../core/components/kit/Modal/Modal";
import { Typography } from "../../../../../core/components/kit/Typography/Typography";
import { getPromocodes, updatePromocode } from "../../../../../core/services/main.service";
import { queryClient } from "../../../../../main";
import { Header } from "../../../components/EditHeader/EditHeader";
import { ItemCard } from "../../../components/ItemCard/ItemCard";
import { CreateForm } from "./CreateForm/CreateForm";

export const Promocodes = () => {
  const [modal, setModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const { data: promocodesData } = useQuery([GetAllPromocodesPath], getPromocodes);

  const { error: deleteError, mutate: mutateUpdatePromocode } = useMutation([UpdatePromocodesPath], updatePromocode, {
    onSuccess: () => {
      queryClient.invalidateQueries([GetAllPromocodesPath]);
    },
  });

  return (
    <>
      <Modal open={modal} onClose={() => setModal(false)}>
        <CreateForm />
      </Modal>

      <Header>
        <Typography variant="h4">Promocodes</Typography>
        <Button onClick={() => setModal(true)}>Add</Button>
      </Header>

      <Outlet />

      {promocodesData?.data.promocodes.map((promocode) => (
        <ItemCard
          key={promocode.name}
          actions={
            <>
              <Button variant="text" onClick={() => navigate(`${promocode.name}/edit`)}>
                Update
              </Button>

              {promocode.softDeleted ? (
                <Button
                  color="warning"
                  onClick={() => mutateUpdatePromocode({ name: promocode.name, softDeleted: false })}
                  variant="text"
                >
                  Restore
                </Button>
              ) : (
                <Button
                  color="error"
                  onClick={() => mutateUpdatePromocode({ name: promocode.name, softDeleted: true })}
                  variant="text"
                >
                  Delete
                </Button>
              )}
            </>
          }
        >
          <Typography color={promocode.softDeleted ? "error" : "inherit"}>{promocode.name}</Typography>{" "}
          {promocode.softDeleted && (
            <Typography variant="caption" color="error">
              Deleted
            </Typography>
          )}
        </ItemCard>
      ))}
    </>
  );
};
