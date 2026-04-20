import { api } from "../../../api/apiConfig";

export const getChatUsers = async () => {
  const response = await api.get("/chats/users");

  return response.data;
};

export const getMessagesByUser = async (userId) => {
  const response = await api.get(`/chats/messages/${userId}`);

  return response.data;
};
