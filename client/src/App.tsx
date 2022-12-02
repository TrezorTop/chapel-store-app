import Cookies from "js-cookie";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RegisterPath } from "../../shared/register";

import { RequireAuth } from "./core/components/hoc/RequireAuth/RequireAuth";
import { IUserContext } from "./core/types/types";
import { mainUrl, signInUrl, signUpUrl, storeUrl, userToken } from "./core/utils/consts";
import { SignIn } from "./views/auth/SignIn/SignIn";
import { SignUp } from "./views/auth/SignUp/SignUp";
import { Store } from "./views/store/Store/Store";

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
        <Route path={mainUrl} element={<Navigate to={storeUrl} />} />
        <Route path={signInUrl} element={<SignIn />} />
        <Route path={signUpUrl} element={<SignUp />} />
        <Route
          path={storeUrl}
          element={
            <RequireAuth>
              <Store />
            </RequireAuth>
          }
        />
        <Route path={"*"} element={<Navigate to={storeUrl} />} />
      </Routes>
    </UserContext.Provider>
  );
};
