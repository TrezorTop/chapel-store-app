import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { MainLayout } from "./core/components/hoc/MainLayout/MainLayout";
import {
  fallbackUrl,
  mainUrl,
  profileUrl,
  signInUrl,
  signUpUrl,
} from "./core/utils/consts";
import { SignIn } from "./views/auth/SignIn/SignIn";
import { SignUp } from "./views/auth/SignUp/SignUp";
import { Main } from "./views/main/Main/Main";
import { Profile } from "./views/main/Profile/Profile";

export const App = () => {
  return (
    <Routes>
      <Route path={signInUrl} element={<SignIn />} />
      <Route path={signUpUrl} element={<SignUp />} />
      <Route path={mainUrl} element={<MainLayout />}>
        <Route index element={<Main />} />
        <Route path={profileUrl} element={<Profile />} />
      </Route>
      <Route path={fallbackUrl} element={<Navigate to={mainUrl} />} />
    </Routes>
  );
};
