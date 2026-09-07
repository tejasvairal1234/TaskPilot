import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/auth/UserModel.js";
import Task from "../../models/tasks/TaskModel.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../helpers/generateToken.js";

// ─── Cookie Options ───────────────────────────────────────────────────────────
const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
});

// ─── REGISTER ─────────────────────────────────────────────────────────────────
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(409).json({
      success: false,
      message: "An account with this email already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.cookie("refreshToken", refreshToken, getRefreshCookieOptions());

  return res.status(201).json({
    success: true,
    message: "Account created successfully",
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      bio: user.bio,
      role: user.role,
    },
  });
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.cookie("refreshToken", refreshToken, getRefreshCookieOptions());

  return res.status(200).json({
    success: true,
    message: "Login successful",
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      bio: user.bio,
      role: user.role,
    },
  });
});

// ─── REFRESH ACCESS TOKEN ─────────────────────────────────────────────────────
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token not found",
      code: "REFRESH_TOKEN_MISSING",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = generateAccessToken(decoded.userId);

    return res.status(200).json({
      success: true,
      accessToken,
    });
  } catch {
    // Clear the invalid/expired cookie
    res.clearCookie("refreshToken", getRefreshCookieOptions());

    return res.status(401).json({
      success: false,
      message: "Session expired. Please log in again.",
      code: "REFRESH_TOKEN_EXPIRED",
    });
  }
});

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// ─── GET CURRENT USER ─────────────────────────────────────────────────────────
export const getMe = asyncHandler(async (req, res) => {
  // req.user is already populated by the protect middleware
  const user = req.user;

  return res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      bio: user.bio,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

// ─── UPDATE USER ──────────────────────────────────────────────────────────────
export const updateUser = asyncHandler(async (req, res) => {
  const { name, currentPassword, newPassword } = req.body;

  // Fetch user with password for comparison
  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Update name if provided
  if (name !== undefined) {
    user.name = name.trim();
  }

  // Update password if provided
  if (newPassword) {
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }
    user.password = await bcrypt.hash(newPassword, 12);
  }

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      bio: user.bio,
      role: user.role,
    },
  });
});

// ─── DELETE USER ──────────────────────────────────────────────────────────────
export const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Delete all tasks belonging to this user first
  await Task.deleteMany({ user: userId });

  // Delete the user
  await User.findByIdAndDelete(userId);

  // Clear auth cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Account deleted successfully",
  });
});
