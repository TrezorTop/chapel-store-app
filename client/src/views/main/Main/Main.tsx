import React from "react";

import { MainLayout } from "../../../core/components/hoc/MainLayout/MainLayout";
import { ping } from "../../../core/services/Auth.service";

export const Main = () => {
  return (
    <MainLayout>
      <button onClick={() => ping()}>ping</button>
    </MainLayout>
  );
};
