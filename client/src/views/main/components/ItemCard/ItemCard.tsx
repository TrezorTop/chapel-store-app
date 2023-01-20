import { CircularProgress } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import React, { FC, ReactNode } from "react";

import { GetBundleFilesParams, GetBundleFilesPath } from "../../../../../../shared/endpoints/bundles/getBundleFiles";
import { Button } from "../../../../core/components/kit/Button/Button";
import { Paper } from "../../../../core/components/kit/Paper/Paper";
import { getBundleFiles } from "../../../../core/services/main.service";
import { API_URL, USER_ACCESS_TOKEN_KEY } from "../../../../core/utils/consts/urls";
import { decodeFile } from "../../../../core/utils/functions/file";
import s from "./ItemCard.module.scss";

type TItemCard = {
  entityId?: string;
  entityName?: string;
  actions?: ReactNode;
  children?: ReactNode;
};

export const ItemCard: FC<TItemCard> = ({ children, actions, entityId, entityName }) => {
  return (
    <Paper className={s.root}>
      <div>{children}</div>
      <div>
        {entityId && entityName && (
          <Button
            onClick={() => {
              const now = new Date();
              now.setSeconds(now.getSeconds() + 10);
              document.cookie = `token=${localStorage.getItem(USER_ACCESS_TOKEN_KEY)};expires=${now.toUTCString()};path=/`;
              window.open(API_URL + GetBundleFilesPath.replace(":id", entityId), '_blank');
            }}
            variant="text"
          >
            Download
          </Button>
        )}
        {actions}
      </div>
    </Paper>
  );
};
