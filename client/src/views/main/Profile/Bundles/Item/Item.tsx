import { FC } from "react";

import { GetBundleFilesPath } from "../../../../../../../shared/endpoints/bundles/getBundleFiles";
import { GetMyBundlesResponse } from "../../../../../../../shared/endpoints/me/getMyBundles";
import { Button } from "../../../../../core/components/kit/Button/Button";
import { Paper } from "../../../../../core/components/kit/Paper/Paper";
import { API_URL } from "../../../../../core/utils/consts/urls";
import s from "./Item.module.scss";

type ItemProps = {
  bundle?: GetMyBundlesResponse["bundles"][0];
};

export const Item: FC<ItemProps> = ({ bundle }) => {
  return (
    <Paper className={s.root}>
      <div className={s.header}>
        {bundle?.name}
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            window.open(API_URL + GetBundleFilesPath.replace(":id", bundle?.id!), '_blank');
          }}
        >
          Download
        </Button>
      </div>
      <div className={s.header}></div>
    </Paper>
  );
};
