import express from "express";
import { authUser } from "../middlewares/authMiddleware.js";
import { getUsers, getMessages } from "../controllers/chat.controller.js";

const chatRouter = express.Router();

chatRouter.get("/users", authUser, getUsers);
chatRouter.get("/messages/:userId", authUser, getMessages);

export default chatRouter;
