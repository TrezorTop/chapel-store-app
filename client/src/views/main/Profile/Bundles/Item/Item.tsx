import { useMutation } from "@tanstack/react-query";
import { FC } from "react";
import { GetBundleFilesPath } from "../../../../../../../shared/endpoints/bundles/getBundleFiles";
import { GetMyBundlesResponse } from "../../../../../../../shared/endpoints/me/getMyBundles";
import { Button } from "../../../../../core/components/kit/Button/Button";

import { Paper } from "../../../../../core/components/kit/Paper/Paper";
import { getBundleFiles } from "../../../../../core/services/main.service";
import { decodeFile } from "../../../../../core/utils/functions/file";
import s from "./Item.module.scss";

type ItemProps = {
  bundle?: GetMyBundlesResponse["bundles"][0];
};

export const Item: FC<ItemProps> = ({ bundle }) => {
  const { mutate } = useMutation([GetBundleFilesPath], () => getBundleFiles({ id: bundle?.id! }), {
    onSuccess: ({ data }) => {
      decodeFile(bundle?.name, data);
    },
  });

  return (
    <Paper className={s.root}>
      <div className={s.header}>\
        {bundle?.name}
        <Button variant="outlined" size="small" onClick={() => mutate()}>
          Download
        </Button>
      </div>
      <div className={s.header}></div>
    </Paper>
  );
};
