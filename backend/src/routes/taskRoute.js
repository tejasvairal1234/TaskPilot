import express from "express";
import protect from "../middlewares/protectMiddleware.js";

const taskRoute = express.Router();

taskRoute.post("/create", protect, createTask);
taskRoute.get("/", protect, getTasks);
taskRoute.get("/:id", protect,);
taskRoute.patch("/update/:id", protect,);
taskRoute.delete("/delete/:id", protect,);

export default taskRoute;