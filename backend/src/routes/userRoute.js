import express from "express";
import { loginUser, registerUser } from "../controllers/auth/userController.js";

const userRoute = express.Router();

userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);
// userRoute.get("/logout",);
// userRoute.get("/user",);
// userRoute.patch("/user",);

// userRoute.delete("/delete-user/:id",);
// userRoute.post("/forgot-password",);
// userRoute.post("/reset-password",);
// userRoute.post("/change-password",);

export default userRoute;