import userModel from "../models/user.model.js";
import followModel from "../models/follow.model.js";

export const searchUsers = async (req, res) => {
  const { q } = req.query;

  const users = await userModel.aggregate([
    {
      $search: {
        index: "user_search_feature",
        autocomplete: {
          query: q,
          path: "username",
        },
      },
    },
    {
      $project: {
        username: 1,
        fullname: 1,
        profilePicture: 1,
      },
    },
  ]);

  res.status(200).json({ message: "Users fetched successfully", users });
};

export const followUser = async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.id;

  const isUserExists = await userModel.findById(userId);
  if (!isUserExists) {
    return res.status(404).json({ message: false, message: "User not found" });
  }

  if (userId === currentUserId) {
    return res
      .status(400)
      .json({ success: false, message: "You cannot follow yourself" });
  }

  const isAlreadyFollowing = await followModel.findOne({
    follower: currentUserId,
    followee: userId,
  });
  if (isAlreadyFollowing) {
    return res
      .status(400)
      .json({ success: false, message: "You are already following this user" });
  }

  const follow = new followModel({
    follower: currentUserId,
    followee: userId,
  });
  await follow.save();

  return res
    .status(200)
    .json({ success: true, message: "Follow request sent successfully" });
};
