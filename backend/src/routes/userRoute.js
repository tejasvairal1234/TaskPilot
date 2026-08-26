import express from "express";
import { loginUser, registerUser } from "../controllers/auth/userController.js";

const userRoute = express.Router();

userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);
userRoute.post("/refresh",);
userRoute.post("/logout",)
export default userRoute;