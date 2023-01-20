import { FC } from "react";

import { GetBundleFilesPath } from "../../../../../../../shared/endpoints/bundles/getBundleFiles";
import { GetMyBundlesResponse } from "../../../../../../../shared/endpoints/me/getMyBundles";
import { Button } from "../../../../../core/components/kit/Button/Button";
import { Paper } from "../../../../../core/components/kit/Paper/Paper";
import { API_URL, USER_ACCESS_TOKEN_KEY } from "../../../../../core/utils/consts/urls";
import s from "./Bundle.module.scss";

type ItemProps = {
  bundle?: GetMyBundlesResponse["bundles"][0];
};

export const Bundle: FC<ItemProps> = ({ bundle }) => {
  return (
    <Paper className={s.root}>
      <div className={s.header}>
        {bundle?.name}
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            const now = new Date();
            now.setSeconds(now.getSeconds() + 10);
            document.cookie = `token=${localStorage.getItem(USER_ACCESS_TOKEN_KEY)};expires=${now.toUTCString()};path=/`;
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
