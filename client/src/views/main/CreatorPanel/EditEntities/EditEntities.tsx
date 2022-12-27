import { Tab, Tabs } from "@mui/material";
import React, { useState } from "react";

import { Paper } from "../../../../core/components/kit/Paper/Paper";
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

  return (
    <Paper className={s.root}>
      <Tabs value={selectedTab} orientation="vertical" onChange={(_, value) => setSelectedTab(value)}>
        <Tab value={TabValues.CARS} label={TabValues.CARS} />
        <Tab value={TabValues.BUNDLES} label={TabValues.BUNDLES} />
        <Tab value={TabValues.CONFIGS} label={TabValues.CONFIGS} />
      </Tabs>

      <div className={s.content}>
        {selectedTab === TabValues.CARS && <Cars />}
        {selectedTab === TabValues.BUNDLES && <Bundles />}
        {selectedTab === TabValues.CONFIGS && <Configs />}
      </div>
    </Paper>
  );
};
