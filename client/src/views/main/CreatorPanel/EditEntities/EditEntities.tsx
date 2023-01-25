import { Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router";

import {
  EDIT_ENTITIES_BUNDLES_URL,
  EDIT_ENTITIES_CARS_URL,
  EDIT_ENTITIES_PROMOCODES_URL,
  EDIT_ENTITIES_SETUPS_URL,
  UPDATE_ENTITY_URL,
} from "../../../../core/utils/consts/urls";
import { Bundles } from "./Bundles/Bundles";
import { EditBundleForm } from "./Bundles/EditBundleForm/EditBundleForm";
import { Cars } from "./Cars/Cars";
import { EditCarsForm } from "./Cars/EditCarsForm/EditCarsForm";
import s from "./EditEntities.module.scss";
import { EditPromocodesForm } from "./Promocodes/EditPromocodesForm/EditPromocodesForm";
import { Promocodes } from "./Promocodes/Promocodes";
import { EditSetupsForm } from "./Setups/EditSetupsForm/EditSetupsForm";
import { Setups } from "./Setups/Setups";

enum TabValues {
  Cars = "CARS",
  Bundles = "BUNDLES",
  Setups = "SETUPS",
  Promocodes = "PROMOCODES"
}

export const EditEntities = () => {
  const [selectedTab, setSelectedTab] = useState<TabValues>(TabValues.Cars);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.includes(EDIT_ENTITIES_CARS_URL)) return setSelectedTab(TabValues.Cars);
    if (location.pathname.includes(EDIT_ENTITIES_BUNDLES_URL)) return setSelectedTab(TabValues.Bundles);
    if (location.pathname.includes(EDIT_ENTITIES_SETUPS_URL)) return setSelectedTab(TabValues.Setups);
    if (location.pathname.includes(EDIT_ENTITIES_PROMOCODES_URL)) return setSelectedTab(TabValues.Promocodes);
  }, [location.pathname]);

  return (
    <div className={s.root}>
      <div>
        <Tabs value={selectedTab} orientation="vertical" onChange={(_, value) => setSelectedTab(value)}>
          <Tab value={TabValues.Cars} label={TabValues.Cars} onClick={() => navigate(EDIT_ENTITIES_CARS_URL)} />
          <Tab value={TabValues.Setups} label={TabValues.Setups} onClick={() => navigate(EDIT_ENTITIES_SETUPS_URL)} />
          <Tab
            value={TabValues.Bundles}
            label={TabValues.Bundles}
            onClick={() => navigate(EDIT_ENTITIES_BUNDLES_URL)}
          />
          <Tab
            value={TabValues.Promocodes}
            label={TabValues.Promocodes}
            onClick={() => navigate(EDIT_ENTITIES_PROMOCODES_URL)}
          />
        </Tabs>
      </div>

      <div className={s.content}>
        <Routes>
          <Route
            path={EDIT_ENTITIES_CARS_URL}
            element={<Cars />}
            children={<Route path={UPDATE_ENTITY_URL} element={<EditCarsForm />} />}
          />
          <Route
            path={EDIT_ENTITIES_BUNDLES_URL}
            element={<Bundles />}
            children={<Route path={UPDATE_ENTITY_URL} element={<EditBundleForm />} />}
          />
          <Route
            path={EDIT_ENTITIES_SETUPS_URL}
            element={<Setups />}
            children={<Route path={UPDATE_ENTITY_URL} element={<EditSetupsForm />} />}
          />
          <Route
            path={EDIT_ENTITIES_PROMOCODES_URL}
            element={<Promocodes />}
            children={<Route path={UPDATE_ENTITY_URL} element={<EditPromocodesForm />} />}
          />
          <Route path={""} element={<Navigate to={"../"} />} />
        </Routes>
      </div>
    </div>
  );
};
