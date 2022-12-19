import React from "react";

import { MainLayout } from "../../../core/components/hoc/MainLayout/MainLayout";
import { usePing } from "../../../core/utils/hooks/services/auth.service";

export const Main = () => {
  const { mutate } = usePing();

  return (
    <MainLayout>
      {/* <Button variant="contained" onClick={() => mutate()}>
        ping server
      </Button> */}
    </MainLayout>
  );
};
