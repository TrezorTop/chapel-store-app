import { Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { STATISTICS_PROMOCODES_URL } from "../../../../core/utils/consts/consts";
import { Promocodes } from "./Promocodes/Promocodes";

import s from "./Statistics.module.scss";

enum TabValues {
  Statistics = "STATISTICS",
}

export const Statistics = () => {
  const [selectedTab, setSelectedTab] = useState<TabValues>(TabValues.Statistics);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.includes(STATISTICS_PROMOCODES_URL)) return setSelectedTab(TabValues.Statistics);
  }, [location.pathname]);

  return (
    <div className={s.root}>
      <div>
        <Tabs value={selectedTab} orientation="vertical" onChange={(_, value) => setSelectedTab(value)}>
          <Tab
            value={TabValues.Statistics}
            label={TabValues.Statistics}
            onClick={() => navigate(STATISTICS_PROMOCODES_URL)}
          />
        </Tabs>
      </div>

      <div className={s.content}>
        <Routes>
          <Route
            path={STATISTICS_PROMOCODES_URL}
            element={<Promocodes />}
            // children={<Route path={UPDATE_ENTITY_URL} element={<EditCarsForm />} />}
          />
        </Routes>
      </div>
    </div>
  );
};
