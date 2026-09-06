import express from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  getMe,
  updateUser,
  deleteUser,
} from "../controllers/auth/userController.js";
import validate from "../middlewares/validateMiddleware.js";
import protect from "../middlewares/protectMiddleware.js";
import {
  loginSchema,
  registerSchema,
  updateUserSchema,
} from "../validators/authValidator.js";

const userRoute = express.Router();

// Public routes
userRoute.post("/register", validate(registerSchema), registerUser);
userRoute.post("/login", validate(loginSchema), loginUser);
userRoute.post("/refresh", refreshAccessToken);
userRoute.post("/logout", logoutUser);

// Protected routes
userRoute.get("/me", protect, getMe);
userRoute.put("/me", protect, validate(updateUserSchema), updateUser);
userRoute.delete("/me", protect, deleteUser);

export default userRoute;