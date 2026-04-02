import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 */

// api/auth/register
export const register = async (req, res) => {
  try {
    const { email, username, fullname, password } = req.body;
    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email or username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      email,
      username,
      fullname,
      password: hashedPassword,
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, config.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
      strict: process.env.NODE_ENV === "production",
      secure: true,
    });

    res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        fullname: newUser.fullname,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during registration" });
  }
};

// api/auth/login
export const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or username" });
    }

    const hashedPassword = user.password;
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
      strict: process.env.NODE_ENV === "production",
      secure: true,
    });
    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during login" });
  }
};

// api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({
      message: "User profile fetched successfully",
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching user" });
  }
};

// api/auth/google/callback
export const googleCallback = async (req, res) => {
  const { id, displayName, emails, photos } = req.user;

  const isUserExists = await userModel.findOne({
    $or: [
      { googleId: id },
      { email: emails[0].value },
      { username: emails[0].value.split("@")[0] },
    ],
  });

  if (isUserExists) {
    const token = jwt.sign({ id: isUserExists._id }, config.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
    });

    return res.status(200).json({
      message: "User logged in successfully",
      success: true,
      user: {
        id: isUserExists._id,
        username: isUserExists.username,
        email: isUserExists.email,
        fullname: isUserExists.fullname,
      },
    });
  }

  const user = new userModel({
    username: emails[0].value.split("@")[0],
    email: emails[0].value,
    fullname: displayName,
    googleId: id,
  });
  await user.save();
  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
  });

  return res.status(201).json({
    message: "User registered successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      fullname: user.fullname,
    },
  });
};

export const seachUsers = async (req, res) => {
  
};
