import { createTheme, ThemeProvider } from "@mui/material";
import React, { Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import s from "./App.module.scss";
import { AuthLayout } from "./core/components/hoc/layouts/AuthLayout/AuthLayout";
import { MainLayout } from "./core/components/hoc/layouts/MainLayout/MainLayout";
import { RequireAuth } from "./core/components/hoc/RequireAuth/RequireAuth";
import { GlobalLoader } from "./core/components/kit/GlobalLoader/GlobalLoader";
import {
  ABOUT_URL,
  AUTH_URL,
  COLOR_THEME_KEY,
  CREATOR_URL,
  GET_SETUP_URL,
  MAIN_URL,
  PAYMENT_URL,
  PROFILE_URL,
  RESTORE_URL,
  SIGN_IN_URL,
  SIGN_UP_URL,
} from "./core/utils/consts/urls";
import { Restore } from "./views/auth/Restore/Restore";
import { SignIn } from "./views/auth/SignIn/SignIn";
import { SignUp } from "./views/auth/SignUp/SignUp";
import { About } from "./views/main/About/About";
import { Main } from "./views/main/Main/Main";
import { Payment } from "./views/main/Payment/Payment";

const CreatorPanel = React.lazy(() => import("./views/main/CreatorPanel/CreatorPanel"));
const Profile = React.lazy(() => import("./views/main/Profile/Profile"));

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

export const App = () => {
  const [mode, setMode] = React.useState<"light" | "dark">(
    localStorage.getItem(COLOR_THEME_KEY) === "true" ? "dark" : "light",
  );
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          return prevMode === "light" ? "dark" : "light";
        });
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          secondary: {
            main: "#FF4C29",
          },
          ...(mode === "dark" && {
            background: {
              paper: "#082032",
            },
          }),
        },
      }),
    [mode],
  );

  return (
    <div className={s.app} data-theme={localStorage.getItem(COLOR_THEME_KEY) === "true" ? "dark" : "light"}>
      <ThemeProvider theme={theme}>
        <ColorModeContext.Provider value={colorMode}>
          <Routes>
            <Route path={AUTH_URL} element={<AuthLayout />}>
              <Route path={SIGN_IN_URL} element={<SignIn />} />
              <Route path={SIGN_UP_URL} element={<SignUp />} />
              <Route path={RESTORE_URL} element={<Restore />} />
              <Route path={""} element={<Navigate to={SIGN_IN_URL} />} />
            </Route>
            <Route path={MAIN_URL} element={<MainLayout />}>
              <Route path={GET_SETUP_URL} element={<Main />} />
              <Route
                path={PAYMENT_URL + "/:bundleId"}
                element={
                  <RequireAuth>
                    <Payment />
                  </RequireAuth>
                }
              />
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
              <Route path={ABOUT_URL} element={<About />} />
              <Route path={""} element={<Navigate to={GET_SETUP_URL} />} />
            </Route>
            <Route path={"*"} element={<Navigate to={MAIN_URL} />} />
          </Routes>
        </ColorModeContext.Provider>
      </ThemeProvider>
    </div>
  );
};
