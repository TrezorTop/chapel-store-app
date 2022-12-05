import React, { FC, ReactNode } from "react";

import { Footer } from "./Footer/Footer";
import { Header } from "./Header/Header";
import { Main } from "./Main/Main";
import s from "./MainLayout.module.scss";

interface IAuthLayoutProps {
  children?: ReactNode;
}

export const MainLayout: FC<IAuthLayoutProps> = ({ children }) => {
  return (
    <div className={s.root}>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </div>
  );
};
