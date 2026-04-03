import express from "express";
import {
  uploadStory,
  getStories,
} from "../controllers/story.controller.js";
import { authUser } from "../middlewares/authMiddleware.js";
import multer from "multer";

const router = express.Router();

const uploadInsta = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

router.post("/upload", authUser, uploadInsta.single("media"), uploadStory);
router.get("/feed", authUser, getStories);

export default router;
