import userModel from "../models/user.model.js";
import followModel from "../models/follow.model.js";
import postModel from "../models/post.model.js";
import mongoose from "mongoose";


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
      $lookup: {
        from: "follows",
        as: "followDoc",
        let: { searchUser: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$followee", "$$searchUser"],
                  },
                  {
                    $eq: [
                      "$follower",
                      new mongoose.Types.ObjectId(req.user.id),
                    ],
                  },
                ],
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        followStatus: {
          $cond: {
            if: {
              $eq: [{ $size: "$followDoc" }, 0],
            },
            then: "not-following",
            else: {
              $cond: {
                if: {
                  $eq: [
                    {
                      $arrayElemAt: ["$followDoc.status", 0],
                    },
                    "pending",
                  ],
                },
                then: "requested",
                else: "following",
              },
            },
          },
        },
      },
    },
    {
      $project: {
        username: 1,
        fullname: 1,
        profilePicture: 1,
        followStatus: 1,
      },
    },
  ]);

  res.status(200).json({
    message: "Users fetched successfully",
    users,
  });
};

export const followUser = async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.id;

  const isUserExists = await userModel.findById(userId);
  if (!isUserExists) {
    return res.status(404).json({ success: false, message: "User not found" });
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

export const getFollowRequests = async (req, res) => {
  const loggedInUserId = req.user.id;

  const requests = await followModel
    .find({ followee: loggedInUserId, status: "pending" })
    .populate("follower", "username  profilePicture");

  res.status(200).json({
    success: true,
    message: "Follow requests fetched successfully",
    requests,
  });
};

export const acceptFollowRequest = async (req, res) => {
  const { requestId } = req.params;
  const loggedInUserId = req.user.id;

  const request = await followModel.findById(requestId);

  if (!request) {
    return res
      .status(404)
      .json({ success: false, message: "Follow request not found" });
  }

  if (request.followee.toString() !== loggedInUserId) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to update this request",
    });
  }

  if (request.status === "accepted") {
    return res.status(200).json({
      success: true,
      message: "Follow request already accepted",
      request,
    });
  }

  request.status = "accepted";
  await request.save();

  return res.status(200).json({
    success: true,
    message: "Follow request accepted successfully",
    request,
  });
};

export const getMyProfileData = async (req, res) => {
  const loggedInUserId = req.user.id;

  const user = await userModel
    .findById(loggedInUserId)
    .select("username profilePicture");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const [followersCount, followingCount] = await Promise.all([
    followModel.countDocuments({
      followee: loggedInUserId,
      status: "accepted",
    }),
    followModel.countDocuments({
      follower: loggedInUserId,
      status: "accepted",
    }),
  ]);

  const posts = await postModel
    .find({ author: loggedInUserId })
    .sort({ createdAt: -1 });

  const profilePicture = user.profilePicture;

  return res.status(200).json({
    success: true,
    message: "Profile data fetched successfully",
    profile: {
      followersCount,
      followingCount,
      postsCount: posts.length,
    },
    posts: posts.map((post) => ({
      ...post.toObject(),
      author: {
        id: user._id,
        username: user.username,
        profilePicture,
      },
    })),
  });
};

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
    { $project: { user: 1 } },
    {
      $group: {
        _id: "$user",
        user: { $first: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: "$user._id",
        user: "$user.user",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: "$user._id",
        username: "$user.username",
        profilePicture: "$user.profilePicture",
      },
    },
  ]);

  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    users,
  });
};

// const users = await userModel.aggregate([
//   {
//     $search: {
//       index: "user_search_feature",
//       autocomplete: {
//         query: q,
//         path: "username",
//       },
//     },
//   },
//   {
//     $project: {
//       username: 1,
//       fullname: 1,
//       profilePicture: 1,
//     },
//   },
// ]);
