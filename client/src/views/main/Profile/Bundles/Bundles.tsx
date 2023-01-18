import { CircularProgress, LinearProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useInterval } from "usehooks-ts";
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
    refetch: refetchProfile,
    isSuccess,
    isError,
  } = useQuery([GetMyInfoPath], getMyProfileInfo, {
    enabled: !!localStorage.getItem(USER_ACCESS_TOKEN_KEY),
    retry: false,
  });

  const { isFetching, refetch: refetchCheck } = useQuery([CheckMyPaymentsPath], checkMyPayments, {
    onSuccess: () => {
      refetchProfile();
    },
  });

  useInterval(
    () => {
      refetchCheck();
    },
    profileData?.data.me.isUnprocessedOrders ? 5000 : null,
  );

  return (
    <div>
      <div className={s.header}>
        <div>
          <Typography variant="h4">
            Purchased Bundles
            {profileData?.data.me.isUnprocessedOrders && <LinearProgress />}
          </Typography>
        </div>
        <div className={s.action}>
          {isFetching && <CircularProgress size={25} />}
          <Button onClick={() => refetchCheck()} disabled={isFetching}>
            Refresh
          </Button>
        </div>
      </div>

      <div className={s.container}>
        {profileData?.data.me.isUnprocessedOrders && <Typography variant="h6">Payment in progress</Typography>}
        {bundlesData?.data.bundles.length ? (
          bundlesData?.data.bundles.map((bundle) => <Item key={bundle.id} bundle={bundle} />)
        ) : (
          <Typography variant="h5">No Bundles</Typography>
        )}
      </div>
    </div>
  );
};
