import { CircularProgress, LinearProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { CheckMyPaymentsPath } from "../../../../../../shared/endpoints/me/checkMyPayments";

import { GetMyBundlesPath } from "../../../../../../shared/endpoints/me/getMyBundles";
import { GetMyInfoPath } from "../../../../../../shared/endpoints/me/myInfo";
import { Button } from "../../../../core/components/kit/Button/Button";
import { Typography } from "../../../../core/components/kit/Typography/Typography";
import { checkMyPayments, getMyProfileInfo, getProfileBundles } from "../../../../core/services/profile.service";
import { USER_ACCESS_TOKEN_KEY } from "../../../../core/utils/consts/urls";
import s from "./Bundles.module.scss";
import { Item } from "./Item/Item";

export const Bundles = () => {
  const { data: bundlesData } = useQuery([GetMyBundlesPath], getProfileBundles);

  const {
    data: profileData,
    refetch,
    isSuccess,
    isError,
  } = useQuery([GetMyInfoPath], getMyProfileInfo, {
    enabled: !!localStorage.getItem(USER_ACCESS_TOKEN_KEY),
    retry: false,
  });

  const { isFetching, refetch: refetchCheck } = useQuery([CheckMyPaymentsPath], checkMyPayments);

  return (
    <div>
      <div className={s.header}>
        <Typography variant="h4">
          Purchased Bundles
          {profileData?.data.me.isUnprocessedOrders && <LinearProgress />}
        </Typography>
        <div className={s.action}>
          {isFetching && <CircularProgress size={25} />}
          <Button onClick={() => refetchCheck()} disabled={isFetching}>
            Refresh
          </Button>
        </div>
      </div>

      <div className={s.container}>
        {bundlesData?.data.bundles.length ? (
          bundlesData?.data.bundles.map((bundle) => <Item key={bundle.id} bundle={bundle} />)
        ) : (
          <Typography variant="h5">No Bundles</Typography>
        )}
      </div>
    </div>
  );
};
