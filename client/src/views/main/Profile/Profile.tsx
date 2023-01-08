import { Configs } from "./Configs/Configs";
import s from "./Profile.module.scss";
import { UserInfo } from "./UserInfo/UserInfo";

const Profile = () => {
  return (
    <div className={s.root}>
      {/* <UserInfo /> */}
      <Configs />
    </div>
  );
};

export default Profile;
