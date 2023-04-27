import { Box } from "@mui/material";
import { useState } from "react";
import { Button } from "../../../../core/components/kit/Button/Button";
import { Modal } from "../../../../core/components/kit/Modal/Modal";
import { Typography } from "../../../../core/components/kit/Typography/Typography";
import { CreatePaymentForm } from "./CreatePaymentForm/CreatePaymentForm";

export const Admin = () => {
  const [modal, setModal] = useState<boolean>(false);

  return (
    <>
      <Modal open={modal} onClose={() => setModal(false)}>
        <CreatePaymentForm onClose={() => setModal(false)} />
      </Modal>

      <Box display="flex" gap="32px" alignItems="center">
        <Button variant="contained" onClick={() => setModal(true)}>
          Add bundle to user
        </Button>
        <Typography>Charges the specified setup to the user</Typography>
      </Box>
    </>
  );
};
