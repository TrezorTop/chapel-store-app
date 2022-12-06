import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { RequireAuth } from "./core/components/hoc/RequireAuth/RequireAuth";
import { mainUrl, signInUrl, signUpUrl } from "./core/utils/consts";
import { SignIn } from "./views/auth/SignIn/SignIn";
import { SignUp } from "./views/auth/SignUp/SignUp";
import { Main } from "./views/main/Main/Main";

export const App = () => {
  return (
    <Routes>
      <Route path={signInUrl} element={<SignIn />} />
      <Route path={signUpUrl} element={<SignUp />} />
      <Route
        path={mainUrl}
        element={
          <RequireAuth>
            <Main />
          </RequireAuth>
        }
      />
      <Route path={"*"} element={<Navigate to={mainUrl} />} />
    </Routes>
  );
};
