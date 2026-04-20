import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { getChatUsers, getMessagesByUser } from "../services/chat.api.js";
import {
  setChats,
  setCurrentChatId,
  setChatMessages,
  appendMessage,
} from "../chat.slice.js";

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

  const handleSetCurrentChatId = useCallback(
    (chatId) => {
      dispatch(setCurrentChatId(chatId));
    },
    [dispatch]
  );

  const handleAppendMessage = useCallback(
    ({ message, receiverId, senderId, currentChatId }) => {
      dispatch(appendMessage({ message, receiverId, senderId, currentChatId }));
    },
    [dispatch]
  );

  const handleGetMessages = useCallback(
    async (chatId) => {
      if (!chatId) return;

      try {
        const data = await getMessagesByUser(chatId);
        dispatch(
          setChatMessages({
            chatId,
            messages: data.messages || [],
          })
        );
      } catch (error) {
        dispatch(
          setChatMessages({
            chatId,
            messages: [],
          })
        );
        throw error;
      }
    },
    [dispatch]
  );

  return {
    handleGetChatUsers,
    handleSetCurrentChatId,
    handleAppendMessage,
    handleGetMessages,
  };
};
