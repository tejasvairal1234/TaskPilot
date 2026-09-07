import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/auth/UserModel.js";

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
      code: "ACCESS_TOKEN_MISSING",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.userId).select(
      "-password -__v"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found or account deleted",
        code: "USER_NOT_FOUND",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        error.name === "TokenExpiredError"
          ? "Access token expired"
          : "Access token invalid",
      code:
        error.name === "TokenExpiredError"
          ? "ACCESS_TOKEN_EXPIRED"
          : "ACCESS_TOKEN_INVALID",
    });
  }
});

export default protect;
