import express from "express";
import {
  acceptFollowRequest,
  followUser,
  getMyProfileData,
  getFollowRequests,
  searchUsers,
  getUsers
} from "../controllers/user.controller.js";
import { authUser } from "../middlewares/authMiddleware.js";
import {
  validateFollowRequest,
  validateFollowUser,
} from "../validators/user.validator.js";

const userRouter = express.Router();

userRouter.get("/search", authUser, searchUsers);
userRouter.get("/me/profile", authUser, getMyProfileData);
userRouter.post("/follow/:userId", authUser, validateFollowUser, followUser);
userRouter.get("/follow-requests", authUser, getFollowRequests);
userRouter.patch(
  "/follow-requests/:requestId",
  authUser,
  validateFollowRequest,
  acceptFollowRequest
);

export default userRouter;
