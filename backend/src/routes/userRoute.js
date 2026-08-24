import express from "express";

const userRoute = express.Router();

userRoute.post("/register",);
userRoute.post("/register",);
userRoute.get("/logout",);
userRoute.get("/user",);
userRoute.patch("/user",);

userRoute.delete("/delete-user/:id",);
userRoute.post("/forgot-password",);
userRoute.post("/reset-password",);
userRoute.post("/change-password",);

export default userRoute;