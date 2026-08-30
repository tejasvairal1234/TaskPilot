import express from "express";
import protect from "../middlewares/protectMiddleware.js";
import { createTask, deleteTask, getTaskByTitle, getTasks, updateTask } from "../controllers/task/taskController.js";
// import { validate } from "zod";
import { createTaskSchema, updateTaskSchema } from "../validators/taskValidator.js";
import validate from "../middlewares/validateMiddleware.js";

const taskRoute = express.Router();

taskRoute.post("/create", protect, validate(createTaskSchema), createTask);
taskRoute.get("/", protect, getTasks);
taskRoute.get("/search", protect, getTaskByTitle);
taskRoute.patch("/update/:id", protect, validate(updateTaskSchema), updateTask);
taskRoute.delete("/delete/:id", protect, deleteTask);

export default taskRoute;