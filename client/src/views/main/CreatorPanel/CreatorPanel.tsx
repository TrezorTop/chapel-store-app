import { Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router";

import { Paper } from "../../../core/components/kit/Paper/Paper";
import { Typography } from "../../../core/components/kit/Typography/Typography";
import {
  ADMIN_URL,
  EDIT_ENTITIES_CARS_URL,
  EDIT_ENTITIES_URL,
  STATISTICS_PROMOCODES_URL,
  STATISTICS_URL,
} from "../../../core/utils/consts/consts";
import { Admin } from "./Admin/Admin";
import s from "./CreatorPanel.module.scss";
import { EditEntities } from "./EditEntities/EditEntities";
import { Statistics } from "./Statistics/Statistics";

enum TabValues {
  EditEntities = "EDIT ENTITIES",
  Statistics = "STATISTICS",
  Admin = "ADMIN",
}

const CreatorPanel = () => {
  const [selectedTab, setSelectedTab] = useState<TabValues>(TabValues.EditEntities);

  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.includes(EDIT_ENTITIES_URL)) return setSelectedTab(TabValues.EditEntities);
    if (location.pathname.includes(STATISTICS_URL)) return setSelectedTab(TabValues.Statistics);
    if (location.pathname.includes(ADMIN_URL)) return setSelectedTab(TabValues.Admin);
  }, [location.pathname]);

  return (
    <>
      <Typography variant="h4" marginBottom>
        Creator Panel
      </Typography>
      <Tabs value={selectedTab} onChange={(_, value) => setSelectedTab(value)}>
        <Tab
          value={TabValues.EditEntities}
          label={TabValues.EditEntities}
          onClick={() => navigate(`${EDIT_ENTITIES_URL}/${EDIT_ENTITIES_CARS_URL}`)}
        />
        <Tab
          value={TabValues.Statistics}
          label={TabValues.Statistics}
          onClick={() => navigate(`${STATISTICS_URL}/${STATISTICS_PROMOCODES_URL}`)}
        />
        <Tab value={TabValues.Admin} label={TabValues.Admin} onClick={() => navigate(`${ADMIN_URL}`)} />
      </Tabs>

      <Paper className={s.content}>
        <Routes>
          <Route path={EDIT_ENTITIES_URL + "/*"} element={<EditEntities />} />
          <Route path={STATISTICS_URL + "/*"} element={<Statistics />} />
          <Route path={ADMIN_URL + "/*"} element={<Admin />} />
          <Route path={""} element={<Navigate to={"../"} />} />
        </Routes>
      </Paper>
    </>
  );
};

export default CreatorPanel;
