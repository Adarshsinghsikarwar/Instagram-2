import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice";
import postsReducer from "../features/posts/posts.slice";
import userReducer from "../features/users/user.slice";
import chatReducer from "../features/chats/chat.slice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    user: userReducer,
    chat: chatReducer
  },
});

// UI
// State
// Services
// hooks
