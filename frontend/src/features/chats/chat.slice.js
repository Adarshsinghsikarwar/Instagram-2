import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: {},
  currentChatId: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, action) => {
      const users = action.payload;
      state.chats = users.reduce((acc, user) => {
        acc[user._id] = { ...user, messages: [] };
        return acc;
      }, {});
    },
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
    setChatMessages: (state, action) => {
      const { chatId, messages } = action.payload;

      if (!state.chats[chatId]) {
        state.chats[chatId] = {
          _id: chatId,
          username: "Unknown user",
          profilePicture: "",
          messages: [],
        };
      }

      state.chats[chatId].messages = messages || [];
    },
    appendMessage: (state, action) => {
      const { message, receiverId, senderId, currentChatId } = action.payload;

      // Create a minimal chat object if the chat does not exist yet.
      // This prevents runtime crashes when a message arrives before users load.
      if (!state.chats[currentChatId]) {
        state.chats[currentChatId] = {
          _id: currentChatId,
          username: "Unknown user",
          profilePicture: "",
          messages: [],
        };
      }

      state.chats[currentChatId].messages.push({
        message,
        receiver: receiverId,
        sender: senderId,
      });
    },
  },
});

export const { setChats, setCurrentChatId, setChatMessages, appendMessage } =
  chatSlice.actions;
export default chatSlice.reducer;
