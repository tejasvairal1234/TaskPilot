import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import User from "../../models/auth/UserModel.js";
import generateToken from "../../helpers/generateToken.js";

export const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate request body
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
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
    const hashPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashPassword,
    });

    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Failed to create user",
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    if (!token) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate authentication token",
      });
    }

    // Set authentication cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User successfully registered",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register user error:", error);

    // MongoDB duplicate-key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // Mongoose validation error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err) => err.message
      );

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }

    // Unexpected server error
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
