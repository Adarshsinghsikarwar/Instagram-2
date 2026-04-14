import {
  searchUsers,
  followUser,
  getFollowRequests,
  acceptFollowRequest,
  getMyProfileData,
} from "../services/user.api";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  appendRequest,
  setFollowRequests,
  acceptFollowRequestState,
} from "../user.slice";

export const useUser = () => {
  const dispatch = useDispatch();

  const handleSearchUser = useCallback(async (query) => {
    try {
      const data = await searchUsers(query);
      return data?.users ?? [];
    } catch (error) {
      console.error("Failed to search users", error);
      return [];
    }
  }, []);

  const handleFollowUser = useCallback(
    async ({ userId }) => {
      try {
        const response = await followUser({ userId });
        if (response.success) {
          dispatch(appendRequest(userId));
        }

        return response;
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          "Failed to follow user. Please try again.";
        console.error("Failed to follow user", error);
        return { success: false, message };
      }
    },
    [dispatch]
  );

  const handleAcceptRequest = useCallback(
    async ({ requestId }) => {
      try {
        const response = await acceptFollowRequest({ requestId });

        if (response?.success) {
          dispatch(acceptFollowRequestState(requestId));
        }

        return response;
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          "Failed to accept follow request. Please try again.";
        console.error("Failed to accept follow request", error);
        return { success: false, message };
      }
    },
    [dispatch]
  );

  const handleGetFollowRequests = useCallback(async () => {
    try {
      const response = await getFollowRequests();
      dispatch(setFollowRequests(response?.requests ?? []));
      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to fetch follow requests. Please try again.";
      console.error("Failed to fetch follow requests", error);
      return { success: false, message, requests: [] };
    }
  }, [dispatch]);

  const handleGetMyProfileData = useCallback(async () => {
    try {
      return await getMyProfileData();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to fetch profile data. Please try again.";
      console.error("Failed to fetch profile data", error);
      return { success: false, message, profile: null, posts: [] };
    }
  }, []);

  return {
    handleSearchUser,
    handleFollowUser,
    handleGetFollowRequests,
    handleAcceptRequest,
    handleGetMyProfileData,
  };
};
