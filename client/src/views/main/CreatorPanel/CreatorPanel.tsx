import { Tab, Tabs } from "@mui/material";
import React, { useState } from "react";

import { Typography } from "../../../core/components/kit/Typography/Typography";
import { EditEntities } from "./EditEntities/EditEntities";

enum TabValues {
  EDIT_ENTITIES = "EDIT ENTITIES",
  STATISTICS = "STATISTICS",
}

const CreatorPanel = () => {
  const [selectedTab, setSelectedTab] = useState<TabValues>(TabValues.EDIT_ENTITIES);

  return (
    <>
      <Typography variant="h4" marginBottom>Creator Panel</Typography>
      <Tabs value={selectedTab} onChange={(_, value) => setSelectedTab(value)}>
        <Tab value={TabValues.EDIT_ENTITIES} label={TabValues.EDIT_ENTITIES} />
        <Tab value={TabValues.STATISTICS} label={TabValues.STATISTICS} disabled />
      </Tabs>
      {selectedTab === TabValues.EDIT_ENTITIES && <EditEntities />}
    </>
  );
};

export default CreatorPanel;
