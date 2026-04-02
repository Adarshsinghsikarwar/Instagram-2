import express from "express";
import { authUser } from "../middlewares/authMiddleware.js";
import { createPost, getPosts } from "../controllers/post.controller.js";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
}); // Limit file size to 15MB

const postRouter = express.Router();

postRouter.post("/", authUser, upload.array("media", 7), createPost);
postRouter.get("/", authUser, getPosts);

export default postRouter;
