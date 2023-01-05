import { Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router";

import { Typography } from "../../../core/components/kit/Typography/Typography";
import { EDIT_ENTITIES_URL, STATISTICS_URL } from "../../../core/utils/consts";
import { EditEntities } from "./EditEntities/EditEntities";

enum TabValues {
  EditEntities = "EDIT ENTITIES",
  Statistics = "STATISTICS",
}

const CreatorPanel = () => {
  const [selectedTab, setSelectedTab] = useState<TabValues>(TabValues.EditEntities);

  const navigate = useNavigate();

  return (
    <>
      <Typography variant="h4" marginBottom>
        Creator Panel
      </Typography>
      <Tabs value={selectedTab} onChange={(_, value) => setSelectedTab(value)}>
        <Tab
          value={TabValues.EditEntities}
          label={TabValues.EditEntities}
          onClick={() => navigate(EDIT_ENTITIES_URL)}
        />
        <Tab
          value={TabValues.Statistics}
          label={TabValues.Statistics}
          onClick={() => navigate(STATISTICS_URL)}
          disabled
        />
      </Tabs>
      <Routes>
        <Route path={EDIT_ENTITIES_URL + "/*"} element={<EditEntities />} />
        <Route path={""} element={<Navigate to={EDIT_ENTITIES_URL} />} />
      </Routes>
    </>
  );
};

export default CreatorPanel;
