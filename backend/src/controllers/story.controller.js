import Story from "../models/story.model.js";
import { storyUpload } from "../services/story.service.js";

export const uploadStory = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    const fileBuffer = req.file.buffer;
    const fileName = `story_${Date.now()}_${req.file.originalname}`;

    const uploadResponse = await storyUpload({ buffer: fileBuffer, fileName });
  
    const newStory = await Story.create({
      userId: req.user.id,
      fileUrl: uploadResponse.url,
      fileId: uploadResponse.fileId,
      fileType: req.file.mimetype.startsWith("video") ? "video" : "image",
    });

    res.status(201).json({
      success: true,
      data: newStory,
      message: "Story uploaded successfully",
    });
  } catch (error) {
    console.error("Story upload error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getStories = async (req, res) => {
  try {
    const stories = await Story.find()
      .populate("userId", "username fullname profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: stories });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
