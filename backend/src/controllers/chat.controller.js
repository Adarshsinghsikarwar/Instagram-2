import followModel from "../models/follow.model.js";
import mongoose from "mongoose";
import chatMessageModel from "../models/chat.model.js";

export const getUsers = async (req, res) => {
  const loggedInUserId = req.user.id;

  const users = await followModel.aggregate([
    {
      $match: {
        $or: [
          { followee: new mongoose.Types.ObjectId(loggedInUserId) },
          { follower: new mongoose.Types.ObjectId(loggedInUserId) },
        ],
        status: "accepted",
      },
    },
    {
      $addFields: {
        user: {
          $cond: {
            if: {
              $eq: ["$follower", new mongoose.Types.ObjectId(loggedInUserId)],
            },
            then: "$followee",
            else: "$follower",
          },
        },
      },
    },
    {
      $group: {
        _id: "$user",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: "$user._id",
        username: "$user.username",
        profilePicture: "$user.profilePicture",
      },
    },
  ]);

  return res.status(200).json({
    message: "Users fetched successfully",
    success: true,
    users,
  });
};

export const getMessages = async (req, res) => {
  const canChat = await followModel.findOne({
    $or: [
      {
        follower: req.user.id,
        followee: req.params.userId,
      },
      {
        followee: req.user.id,
        follower: req.params.userId,
      },
    ],
    status: "accepted",
  });
  if (!canChat) {
    return res.status(403).json({
      message: "You are not allowed to chat with this user",
      success: false,
    });
  }

  const messages = await chatMessageModel
    .find({
      $or: [
        {
          sender: req.user.id,
          receiver: req.params.userId,
        },
        {
          receiver: req.user.id,
          sender: req.params.userId,
        },
      ],
    })
    .sort({ createdAt: 1 })
    .exec();

  return res.status(200).json({
    message: "Messages fetched successfully",
    success: true,
    messages,
  });
};
