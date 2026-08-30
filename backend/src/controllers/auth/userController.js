import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/auth/UserModel.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../helpers/generateToken.js";

// ==========================
// REGISTER USER
// ==========================

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate request body
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  // Normalize email
  const normalizedEmail = email.trim().toLowerCase();

  // Check if user already exists
  const userExists = await User.findOne({
    email: normalizedEmail,
  });

  if (userExists) {
    return res.status(409).json({
      success: false,
      message: "User already exists",
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  console.log(user._id);

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Store refresh token in HttpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json({
    success: true,
    message: "User successfully registered",

    // Frontend can store this in sessionStorage
    accessToken,

    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// ==========================
// LOGIN USER
// ==========================

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate request body
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  // Normalize email
  const normalizedEmail = email.trim().toLowerCase();

  // Find user
  const user = await User.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Compare password
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Refresh token → HttpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "Login successful",

    // Frontend → sessionStorage
    accessToken,

    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// ==========================
// Refresh
// ==========================

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
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Refresh token expired or invalid",
      code: "REFRESH_TOKEN_EXPIRED",
    });
  }
});

// ==========================
// Refresh
// ==========================

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});
