import { api } from "../../../api/apiConfig";

export const searchUsers = async (query) => {
  const responses = await api.get("users/search?q=" + query);
  return responses.data;
};
