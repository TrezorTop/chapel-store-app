import { Box } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { FC } from "react";
import { DeleteUncommittedOrderPath } from "../../../../../../../shared/endpoints/me/deleteUncommittedOrder";
import { GetMyInfoPath } from "../../../../../../../shared/endpoints/me/myInfo";

import { Button } from "../../../../../core/components/kit/Button/Button";
import { Paper } from "../../../../../core/components/kit/Paper/Paper";
import { cancelPayment } from "../../../../../core/services/payment.service";
import { queryClient } from "../../../../../main";
import s from "./Order.module.scss";

type ItemProps = {
  id: string;
  bundleName: string;
  orderUrl: string;
};

export const Order: FC<ItemProps> = ({ orderUrl, bundleName, id }) => {
  const { mutate } = useMutation([DeleteUncommittedOrderPath], cancelPayment, {
    onSuccess: () => {
      queryClient.invalidateQueries([GetMyInfoPath]);
    },
  });

  return (
    <Paper className={s.root}>
      <div className={s.header}>
        {bundleName}
        <Box display="flex" gap={"16px"}>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => {
              mutate({ id: id });
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
