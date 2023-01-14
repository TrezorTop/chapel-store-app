import { Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router";

import { Paper } from "../../../core/components/kit/Paper/Paper";
import { Typography } from "../../../core/components/kit/Typography/Typography";
import { EDIT_ENTITIES_CARS_URL, EDIT_ENTITIES_URL, STATISTICS_URL } from "../../../core/utils/consts/urls";
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
          onClick={() => navigate(`${EDIT_ENTITIES_URL}/${EDIT_ENTITIES_CARS_URL}`)}
        />
        <Tab
          value={TabValues.Statistics}
          label={TabValues.Statistics}
          onClick={() => navigate(STATISTICS_URL)}
          disabled
        />
      </Tabs>

      <Paper>
        <Routes>
          <Route path={EDIT_ENTITIES_URL + "/*"} element={<EditEntities />} />
          <Route path={""} element={<Navigate to={"../"} />} />
        </Routes>
      </Paper>
    </>
  );
};

export default CreatorPanel;
