import React, { Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDarkMode } from "usehooks-ts";

import s from "./App.module.scss";
import { AuthLayout } from "./core/components/hoc/layouts/AuthLayout/AuthLayout";
import { MainLayout } from "./core/components/hoc/layouts/MainLayout/MainLayout";
import { RequireAuth } from "./core/components/hoc/RequireAuth/RequireAuth";
import { GlobalLoader } from "./core/components/kit/GlobalLoader/GlobalLoader";
import {
  AUTH_URL,
  CREATOR_URL,
  GET_SETUP_URL,
  MAIN_URL,
  PROFILE_URL,
  SIGN_IN_URL,
  SIGN_UP_URL,
} from "./core/utils/consts/urls";
import { SignIn } from "./views/auth/SignIn/SignIn";
import { SignUp } from "./views/auth/SignUp/SignUp";
import { Main } from "./views/main/Main/Main";

const CreatorPanel = React.lazy(() => import("./views/main/CreatorPanel/CreatorPanel"));
const Profile = React.lazy(() => import("./views/main/Profile/Profile"));

export const App = () => {
  const { isDarkMode, toggle, enable, disable } = useDarkMode();

  useEffect(() => {
    disable();
  }, []);

  return (
    <div className={s.app} data-theme={isDarkMode ? "dark" : "light"}>
      <Routes>
        <Route path={AUTH_URL} element={<AuthLayout />}>
          <Route path={SIGN_IN_URL} element={<SignIn />} />
          <Route path={SIGN_UP_URL} element={<SignUp />} />
          <Route path={""} element={<Navigate to={SIGN_IN_URL} />} />
          {/* <Route path={"*"} element={<Navigate to={SIGN_IN_URL} />} /> */}
        </Route>
        <Route path={MAIN_URL} element={<MainLayout />}>
          <Route path={GET_SETUP_URL} element={<Main />} />
          <Route
            path={PROFILE_URL}
            element={
              <Suspense fallback={<GlobalLoader />}>
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path={CREATOR_URL + "/*"}
            element={
              <Suspense fallback={<GlobalLoader />}>
                <RequireAuth>
                  <CreatorPanel />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route path={""} element={<Navigate to={GET_SETUP_URL} />} />
          {/* <Route path={"*"} element={<Navigate to={GET_CONFIG_URL} />} /> */}
        </Route>
        <Route path={"*"} element={<Navigate to={MAIN_URL} />} />
      </Routes>
    </div>
  );
};
