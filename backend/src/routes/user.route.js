import express from "express";
import { searchUsers } from "../controllers/user.controller.js";
import { authUser } from "../middlewares/authMiddleware.js";
import { validateFollowUser } from "../validators/user.validator.js";
import { followUser } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/search", authUser, searchUsers);
userRouter.post("/follow/:userId", validateFollowUser, authUser, followUser);

export default userRouter;
