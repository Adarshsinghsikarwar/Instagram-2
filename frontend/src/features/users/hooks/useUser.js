import { searchUsers, followUser } from "../services/user.api";
import { useDispatch } from "react-redux";
import { appendRequest } from "../user.slice";

export const useUser = () => {
  const dispatch = useDispatch();

  async function handleSearchUser(query) {
    try {
      const data = await searchUsers(query);
      return data?.users ?? [];
    } catch (error) {
      console.error("Failed to search users", error);
      return [];
    }
  }

  async function handleFollowUser({ userId }) {
    try {
      const response = await followUser({ userId });
      if (response.success) {
        dispatch(appendRequest(userId));
      }

      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to follow user. Please try again.";
      console.error("Failed to follow user", error);
      return { success: false, message };
    }
  }

  return { handleSearchUser, handleFollowUser };
};
