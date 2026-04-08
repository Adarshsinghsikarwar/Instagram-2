import { api } from "../../../api/apiConfig";

export const searchUsers = async (query) => {
  const response = await api.get(
    `/users/search?q=${encodeURIComponent(query)}`
  );
  return response.data;
};

export const followUser = async ({ userId }) => {
  const response = await api.post(`/users/follow/` + userId);
  return response.data;
};
