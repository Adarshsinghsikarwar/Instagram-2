import followModel from "../models/follow.model.js";
import mongoose from "mongoose";

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
