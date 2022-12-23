import { Tab, Tabs } from "@mui/material";
import React, { useState } from "react";

import { Paper } from "../../../../core/components/kit/Paper/Paper";
import s from "./EditEntities.module.scss";

enum TabValues {
  CARS = "CARS",
  BUNDLES = "BUNDLES",
  CONFIGS = "CONFIGS",
}

export const EditEntities = () => {
  const [selectedTab, setSelectedTab] = useState<TabValues>(TabValues.CARS);

  const rows = [
    { id: "1c7260b8-5f15-4c83-a09d-b03cbe15935c", title: "First Config", data: "JSON-HUITA" },
    { id: "6275da99-0048-4a94-b021-ff2fdc2558c4", title: "Second Config", data: "JSON_2" },
  ];

  return (
    <Paper className={s.root}>
      <Tabs value={selectedTab} orientation="vertical" onChange={(_, value) => setSelectedTab(value)}>
        <Tab value={TabValues.CARS} label={TabValues.CARS} />
        <Tab value={TabValues.BUNDLES} label={TabValues.BUNDLES} />
        <Tab value={TabValues.CONFIGS} label={TabValues.CONFIGS} />
      </Tabs>
    </Paper>
  );
};
