import postModel from "../models/post.model.js";
import { uploadFile } from "../services/strorage.service.js";

export const createPost = async (req, res) => {
  const author = req.user.id;
  const { caption } = req.body;

  const files = req.files;

  const media = await Promise.all(
    files.map(async (file) => {
      const result = await uploadFile({
        buffer: file.buffer,
        fileName: file.originalname,
      });

      return {
        url: result.url,
        media_type: file.mimetype.split("/")[0],
      };
    })
  );

  const post = await postModel.create({
    caption,
    author,
    media: media.filter(
      (m) => m.media_type === "image" || m.media_type === "video"
    ),
  });

  return res.status(201).json({
    success: true,
    message: "Post created successfully",
    post,
  });
};

export const getPosts = async (req, res) => {
  const posts = await postModel
    .find()
    .populate("author", "name profilePicture")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Posts retrieved successfully",
    posts,
  });
};


