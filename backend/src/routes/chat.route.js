import express from "express";
import { authUser } from "../middlewares/authMiddleware.js";
import { getUsers } from "../controllers/chat.controller.js";

const chatRouter = express.Router();

chatRouter.get("/users", authUser, getUsers);

export default chatRouter;
