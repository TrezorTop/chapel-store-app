import React, { FC, HTMLAttributes } from "react";
import { Outlet } from "react-router-dom";

import { Footer } from "./Footer/Footer";
import { Header } from "./Header/Header";
import { Main } from "./Main/Main";
import s from "./MainLayout.module.scss";

export const MainLayout: FC = () => {
  return (
    <div className={s.root}>
      <Header />
      <Main className={s.main}>
        <Outlet />
      </Main>
      <Footer />
    </div>
  );
};
