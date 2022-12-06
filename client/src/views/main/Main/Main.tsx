import React from "react";

import { MainLayout } from "../../../core/components/hoc/MainLayout/MainLayout";
import { Button } from "../../../core/components/ui/Button/Button";
import { ping } from "../../../core/services/Auth.service";

export const Main = () => {
  return (
    <MainLayout>
      <Button variant="contained" onClick={() => ping()}>
        ping server
      </Button>
    </MainLayout>
  );
};
