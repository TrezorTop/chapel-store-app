import { CircularProgress, Divider, LinearProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useInterval } from "usehooks-ts";

import { CheckMyPaymentsPath } from "../../../../../../shared/endpoints/me/checkMyPayments";
import { GetMyBundlesPath } from "../../../../../../shared/endpoints/me/getMyBundles";
import { GetMyInfoPath } from "../../../../../../shared/endpoints/me/myInfo";
import { Button } from "../../../../core/components/kit/Button/Button";
import { Typography } from "../../../../core/components/kit/Typography/Typography";
import { checkMyPayments, getMyProfileInfo, getProfileBundles } from "../../../../core/services/profile.service";
import s from "./Bundles.module.scss";
import { Bundle } from "./Bundle/Bundle";
import { Order } from "./Order/Order";

export const Bundles = () => {
  const { data: bundlesData, refetch: refetchMyBundles } = useQuery([GetMyBundlesPath], getProfileBundles);

  const { data: profileData, refetch: refetchProfileData } = useQuery([GetMyInfoPath], getMyProfileInfo);

  const { isFetching, refetch: refetchCheck } = useQuery([CheckMyPaymentsPath], checkMyPayments, {
    onSuccess: () => {
      refetchMyBundles();
    },
  });

  useInterval(
    () => {
      refetchCheck();
      refetchProfileData();
    },
    profileData?.data.me.uncommittedOrders.length ? 5000 : null,
  );

  return (
    <div>
      <div className={s.header}>
        <div>
          <Typography variant="h4">
            Purchased Bundles
            {!!profileData?.data.me.uncommittedOrders.length && <LinearProgress />}
          </Typography>
        </div>
        <div className={s.action}>
          {isFetching && <CircularProgress size={23} />}
          <Button onClick={() => refetchCheck()} disabled={isFetching}>
            Refresh
          </Button>
        </div>
      </div>

      <div className={s.container}>
        {!!profileData?.data.me.uncommittedOrders.length && (
          <>
            <Typography variant="h6">Payment in progress</Typography>
            {profileData?.data.me.uncommittedOrders.map((order) => (
              <Order key={order.id} id={order.id} bundleName={order?.bundle?.name} orderUrl={order.payUrl} />
            ))}
          </>
        )}
        <Divider />
        {bundlesData?.data.bundles.length ? (
          bundlesData?.data.bundles.map((bundle) => <Bundle key={bundle.id} bundle={bundle} />)
        ) : (
          <Typography variant="h5">No Bundles</Typography>
        )}
      </div>
    </div>
  );
};
