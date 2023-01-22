import { Box, CircularProgress } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { FC, useState } from "react";
import { DeleteUncommittedOrderPath } from "../../../../../../../shared/endpoints/me/deleteUncommittedOrder";
import { GetMyInfoPath } from "../../../../../../../shared/endpoints/me/myInfo";

import { Button } from "../../../../../core/components/kit/Button/Button";
import { FormActions } from "../../../../../core/components/kit/Form/FormActions/FormActions";
import { Modal } from "../../../../../core/components/kit/Modal/Modal";
import { ModalActions } from "../../../../../core/components/kit/Modal/ModalActions/ModalActions";
import { Paper } from "../../../../../core/components/kit/Paper/Paper";
import { Typography } from "../../../../../core/components/kit/Typography/Typography";
import { cancelPayment } from "../../../../../core/services/payment.service";
import { queryClient } from "../../../../../main";
import s from "./Order.module.scss";

type ItemProps = {
  id: string;
  bundleName: string;
  orderUrl: string;
};

export const Order: FC<ItemProps> = ({ orderUrl, bundleName, id }) => {
  const [modal, setModal] = useState<boolean>(false);

  const { mutate, isLoading } = useMutation([DeleteUncommittedOrderPath], cancelPayment, {
    onSuccess: () => {
      queryClient.invalidateQueries([GetMyInfoPath]);
      setModal(false);
    },
  });

  return (
    <Paper className={s.root}>
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        modalTitle={<Typography variant="h4">Warning</Typography>}
        modalActons={
          <Button
            fullWidth
            color="error"
            onClick={() => {
              mutate({ id: id });
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
        }
      >
        <>
          <Typography variant="h5">Are you sure you want to cancel the payment?</Typography>
          <Typography variant="h5">
            You will not receive the goods even if you make a payment using the old link
          </Typography>
          <Typography color="error" variant="h5">
            ATTENTION, do not use the old link to process the payment after the cancellation
          </Typography>
        </>
      </Modal>
      <div className={s.header}>
        {bundleName}
        <Box display="flex" gap={"16px"}>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => {
              setModal(true);
              // mutate({ id: id });
            }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              window.open(orderUrl, "_blank");
            }}
          >
            Continue Payment
          </Button>
        </Box>
      </div>
      <div className={s.header}></div>
    </Paper>
  );
};
