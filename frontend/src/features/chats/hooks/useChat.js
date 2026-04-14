import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { getChatUsers } from "../services/chat.api.js";
import { setChats } from "../chat.slice.js";

export const useChat = () => {
  const dispatch = useDispatch();

  const handleGetChatUsers = useCallback(async () => {
    try {
      const data = await getChatUsers();
      dispatch(setChats(data.users || []));
    } catch (error) {
      dispatch(setChats([]));
      throw error;
    }
  }, [dispatch]);

  return {
    handleGetChatUsers,
  };
};
