import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { GetAllConfigsPath } from "../../../../../../../shared/endpoints/configs/getAllConfigs";
import { getConfigs } from "../../../../../core/services/main.service";

export const Configs = () => {
  const [modal, setModal] = useState<boolean>(false);

  // const { data: carsData } = useQuery([GetAllConfigsPath], getConfigs);

  return <></>;
};
