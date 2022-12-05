import Cookies from "js-cookie";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { RequireAuth } from "./core/components/hoc/RequireAuth/RequireAuth";
import { IUserContext } from "./core/types/types";
import { emptyUrl, mainUrl, signInUrl, signUpUrl, userToken } from "./core/utils/consts";
import { SignIn } from "./views/auth/SignIn/SignIn";
import { SignUp } from "./views/auth/SignUp/SignUp";
import { Main } from "./views/main/Main/Main";

const UserContext = React.createContext<IUserContext>({
  isLoggedIn: false,
});

export const App = () => {
  return (
    <UserContext.Provider
      value={{
        isLoggedIn: !!Cookies.get(userToken),
      }}
    >
      <Routes>
        <Route path={emptyUrl} element={<Navigate to={emptyUrl} />} />
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
    </UserContext.Provider>
  );
};
