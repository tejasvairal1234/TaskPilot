import express from "express";
import protect from "../middlewares/protectMiddleware.js";
import { createTask, deleteTask, getTaskByTitle, getTasks, updateTask } from "../controllers/task/taskController.js";

const taskRoute = express.Router();

taskRoute.post("/create", protect, createTask);
taskRoute.get("/", protect, getTasks);
taskRoute.get("/search", protect, getTaskByTitle);
taskRoute.patch("/update/:id", protect, updateTask);
taskRoute.delete("/delete/:id", protect, deleteTask);

export default taskRoute;