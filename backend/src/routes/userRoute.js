import express from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/auth/userController.js";
import validate from "../middlewares/validateMiddleware.js";
import { loginSchema, registerSchema } from "../validators/authValidator.js";

const userRoute = express.Router();

userRoute.post("/register", validate(registerSchema), registerUser);
userRoute.post("/login", validate(loginSchema), loginUser);
userRoute.post("/refresh", refreshAccessToken);
userRoute.post("/logout", logoutUser);

export default userRoute;