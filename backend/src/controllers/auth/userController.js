import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import User from "../../models/auth/UserModel.js";


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
    const refreshToken = generateToken(user._id);

    if (!refreshToken) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate authentication token",
      });
    }

    // Set authentication cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
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

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export const loginUser = asyncHandler(async (req, res) =>
{
    const {email, password} = req.body;
    
    if(!email || !password)
    {
        return res.status(400).json({message: "All fields are required"});
    }

    const userExists = await User.findOne({email});

    if(!userExists)
    {
        return res.status(404).json({message: "User not found"});
    }

    const isMatch = await bcrypt.compare(password, userExists.password);

    if(!isMatch)
    {
        return res.status(400).json({message:"Invalid Password"});
    }

})