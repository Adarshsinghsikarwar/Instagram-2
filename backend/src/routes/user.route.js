import express from "express";
import { searchUsers } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/search", searchUsers);


export default userRouter;