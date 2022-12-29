import { Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router";

import { Paper } from "../../../../core/components/kit/Paper/Paper";
import { EDIT_ENTITIES_BUNDLES_URL, EDIT_ENTITIES_CARS_URL, EDIT_ENTITIES_CONFIGS_URL } from "../../../../core/utils/consts";
import { Bundles } from "./Bundles/Bundles";
import { Cars } from "./Cars/Cars";
import { Configs } from "./Configs/Configs";
import s from "./EditEntities.module.scss";

enum TabValues {
  CARS = "CARS",
  BUNDLES = "BUNDLES",
  CONFIGS = "CONFIGS",
}

export const EditEntities = () => {
  const [selectedTab, setSelectedTab] = useState<TabValues>(TabValues.CARS);

  const navigate = useNavigate();

  return (
    <Paper className={s.root}>
      <Tabs value={selectedTab} orientation="vertical" onChange={(_, value) => setSelectedTab(value)}>
        <Tab value={TabValues.CARS} label={TabValues.CARS} onClick={() => navigate(EDIT_ENTITIES_CARS_URL)} />
        <Tab value={TabValues.BUNDLES} label={TabValues.BUNDLES} onClick={() => navigate(EDIT_ENTITIES_BUNDLES_URL)} />
        <Tab value={TabValues.CONFIGS} label={TabValues.CONFIGS} onClick={() => navigate(EDIT_ENTITIES_CONFIGS_URL)} />
      </Tabs>

      <div className={s.content}>
        <Routes>
          <Route path={EDIT_ENTITIES_CARS_URL} element={<Cars />} />
          <Route path={EDIT_ENTITIES_BUNDLES_URL} element={<Bundles />} />
          <Route path={EDIT_ENTITIES_CONFIGS_URL} element={<Configs />} />
          <Route path={""} element={<Navigate to={EDIT_ENTITIES_CARS_URL} />} />
        </Routes>
      </div>
    </Paper>
  );
};
