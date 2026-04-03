import { searchUsers, followUser} from "../services/user.api";
import { useDispatch } from "react-redux";
import { appendRequest } from "../user.slice";

export const useUser = () => {
  const dispatch = useDispatch();

  async function handleSearchUser(query) {
    const data = await searchUsers(query);
    return data.users;
  }

  async function handleFollowUser({ userId }) {
    const response = await followUser({ userId });
    if (response.success) {
      dispatch(appendRequest(userId));
    }
  }

  return { handleSearchUser, handleFollowUser };
};
