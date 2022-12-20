import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDarkMode } from "usehooks-ts";

import { MainLayout } from "./core/components/hoc/MainLayout/MainLayout";
import { RequireAuth } from "./core/components/hoc/RequireAuth/RequireAuth";
import {
  FALLBACK_URL,
  MAIN_URL,
  PROFILE_URL,
  SIGN_IN_URL,
  SIGN_UP_URL,
} from "./core/utils/consts";
import { SignIn } from "./views/auth/SignIn/SignIn";
import { SignUp } from "./views/auth/SignUp/SignUp";
import { Main } from "./views/main/Main/Main";
import { Profile } from "./views/main/Profile/Profile";

import s from "./App.module.scss";

export const App = () => {
  const { isDarkMode, toggle, enable, disable } = useDarkMode();

  useEffect(() => {
    disable()
  }, [])

  return (
    <div className={s.app} data-theme={isDarkMode ? "dark" : "light"}>
      <Routes>
        <Route path={SIGN_IN_URL} element={<SignIn />} />
        <Route path={SIGN_UP_URL} element={<SignUp />} />
        <Route
          path={MAIN_URL}
          element={
            <RequireAuth>
              <MainLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Main />} />
          <Route path={PROFILE_URL} element={<Profile />} />
        </Route>
        <Route path={FALLBACK_URL} element={<Navigate to={MAIN_URL} />} />
      </Routes>
    </div>
  );
};
