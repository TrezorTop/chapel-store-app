import { CircularProgress } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import React, { FC, ReactNode } from "react";

import { GetBundleFilesParams, GetBundleFilesPath } from "../../../../../../shared/endpoints/bundles/getBundleFiles";
import { Button } from "../../../../core/components/kit/Button/Button";
import { Paper } from "../../../../core/components/kit/Paper/Paper";
import { getBundleFiles } from "../../../../core/services/main.service";
import { decodeFile } from "../../../../core/utils/functions/file";
import s from "./ItemCard.module.scss";

type TItemCard = {
  entityId?: string;
  entityName?: string;
  actions?: ReactNode;
  children?: ReactNode;
};

export const ItemCard: FC<TItemCard> = ({ children, actions, entityId, entityName }) => {
  const { mutate: downloadBundleFiles, isLoading: isDownloading } = useMutation(
    [GetBundleFilesPath],
    ({ id }: GetBundleFilesParams & { name: string }) => getBundleFiles({ id: id }),
    {
      onSuccess: ({ data }, { name }) => {
        decodeFile(data, name);
      },
    },
  );

  return (
    <Paper className={s.root}>
      <div>{children}</div>
      <div>
        {entityId && entityName && (
          <Button
            disabled={isDownloading}
            onClick={() => downloadBundleFiles({ id: entityId, name: entityName })}
            variant="text"
          >
            {isDownloading ? <CircularProgress size={23} /> : <>Download</>}
          </Button>
        )}
        {actions}
      </div>
    </Paper>
  );
};
