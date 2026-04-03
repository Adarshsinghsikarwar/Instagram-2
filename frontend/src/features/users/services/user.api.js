import { api } from "../../../api/apiConfig";

export const searchUsers = async ({ userId }) => {
  const responses = await api.post("users/search?q=" + userId);
  return responses.data;
};

export const followUser = async ({ userId }) => {
  const response = await api.post(`/users/follow/${userId}`);
  return response.data;
};
