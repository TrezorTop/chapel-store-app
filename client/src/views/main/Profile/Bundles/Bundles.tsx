import { useQuery } from "@tanstack/react-query";

import { GetMyBundlesPath } from "../../../../../../shared/endpoints/me/getMyConfigs";
import { Typography } from "../../../../core/components/kit/Typography/Typography";
import { getProfileBundles } from "../../../../core/services/profile.service";
import s from "./Bundles.module.scss";
import { Item } from "./Item/Item";

export const Bundles = () => {
  const { data } = useQuery([GetMyBundlesPath], getProfileBundles);

  return (
    <div>
      <Typography variant="h4" marginBottom>
        Purchased Bundles
      </Typography>

      <div className={s.container}>
        {data?.data.bundles.map((bundle) => (
          <Item key={bundle.id} bundle={bundle} />
        ))}
      </div>
    </div>
  );
};
