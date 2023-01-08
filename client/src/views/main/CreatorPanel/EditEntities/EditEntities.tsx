import { Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router";

import { Paper } from "../../../../core/components/kit/Paper/Paper";
import {
  EDIT_ENTITIES_BUNDLES_URL,
  EDIT_ENTITIES_CARS_URL,
  EDIT_ENTITIES_CONFIGS_URL,
  UPDATE_ENTITY_URL,
} from "../../../../core/utils/consts";
import { Bundles } from "./Bundles/Bundles";
import { EditBundle } from "./Bundles/EditBundle/EditBundle";
import { Cars } from "./Cars/Cars";
import { EditCar } from "./Cars/EditCar/EditCar";
import { Configs } from "./Configs/Configs";
import { EditConfig } from "./Configs/EditConfig/EditConfig";
import s from "./EditEntities.module.scss";

enum TabValues {
  Cars = "CARS",
  Bundles = "BUNDLES",
  Configs = "CONFIGS",
}

export const EditEntities = () => {
  const [selectedTab, setSelectedTab] = useState<TabValues>(TabValues.Cars);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes(EDIT_ENTITIES_CARS_URL)) return setSelectedTab(TabValues.Cars);
    if (location.pathname.includes(EDIT_ENTITIES_BUNDLES_URL)) return setSelectedTab(TabValues.Bundles);
    if (location.pathname.includes(EDIT_ENTITIES_CONFIGS_URL)) return setSelectedTab(TabValues.Configs);
  }, [location.pathname]);

  const navigate = useNavigate();

  return (
    <div className={s.root}>
      <Tabs value={selectedTab} orientation="vertical" onChange={(_, value) => setSelectedTab(value)}>
        <Tab value={TabValues.Cars} label={TabValues.Cars} onClick={() => navigate(EDIT_ENTITIES_CARS_URL)} />
        <Tab value={TabValues.Bundles} label={TabValues.Bundles} onClick={() => navigate(EDIT_ENTITIES_BUNDLES_URL)} />
        <Tab value={TabValues.Configs} label={TabValues.Configs} onClick={() => navigate(EDIT_ENTITIES_CONFIGS_URL)} />
      </Tabs>

      <div className={s.content}>
        <Routes>
          <Route
            path={EDIT_ENTITIES_CARS_URL}
            element={<Cars />}
            children={<Route path={UPDATE_ENTITY_URL} element={<EditCar />} />}
          />
          <Route
            path={EDIT_ENTITIES_BUNDLES_URL}
            element={<Bundles />}
            children={<Route path={UPDATE_ENTITY_URL} element={<EditBundle />} />}
          />
          <Route
            path={EDIT_ENTITIES_CONFIGS_URL}
            element={<Configs />}
            children={<Route path={UPDATE_ENTITY_URL} element={<EditConfig />} />}
          />
          <Route path={""} element={<Navigate to={"../"} />} />
        </Routes>
      </div>
    </div>
  );
};
