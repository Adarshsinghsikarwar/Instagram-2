import { useSelector } from "react-redux";
const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  return (
    <div>
      <h1>{user?.fullname}</h1>
      <h1>{user?.username}</h1>
      <h1>{user?.email}</h1>
    </div>
  );
};

export default Profile;
