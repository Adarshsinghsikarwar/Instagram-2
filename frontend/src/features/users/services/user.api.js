import { api } from "../../../api/apiConfig";

export const searchUsers = async (query) => {
  const response = await api.get(
    `/users/search?q=${encodeURIComponent(query)}`
  );
  return response.data;
};

export const getMyProfileData = async () => {
  const response = await api.get("/users/me/profile");
  return response.data;
};

export const followUser = async ({ userId }) => {
  const response = await api.post(`/users/follow/` + userId);
  return response.data;
};

export async function getFollowRequests() {
  const response = await api.get("/users/follow-requests");
  return response.data;
}

export async function acceptFollowRequest({ requestId }) {
  const response = await api.patch(`/users/follow-requests/${requestId}`);

  return response.data;
}
