import { Bundles } from "./Bundles/Bundles";
import s from "./Profile.module.scss";

const Profile = () => {
  return (
    <div className={s.root}>
      {/* <UserInfo /> */}
      <Bundles />
    </div>
  );
};

export default Profile;
