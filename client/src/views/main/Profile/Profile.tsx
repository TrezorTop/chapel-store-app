import { MainLayout } from "../../../core/components/hoc/MainLayout/MainLayout";
import { Configs } from "./Configs/Configs";
import s from "./Profile.module.scss";
import { UserInfo } from "./UserInfo/UserInfo";

export const Profile = () => {
  return (
    <div className={s.root}>
      <UserInfo />
      <Configs />
    </div>
  );
};
