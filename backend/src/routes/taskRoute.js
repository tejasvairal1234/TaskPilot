import express from "express";
import protect from "../middlewares/protectMiddleware.js";
import {
  createTask,
  deleteTask,
  getDashboardStats,
  getTaskById,
  getTasks,
  updateTask,
} from "../controllers/task/taskController.js";
import { createTaskSchema, updateTaskSchema } from "../validators/taskValidator.js";
import validate from "../middlewares/validateMiddleware.js";

const taskRoute = express.Router();

// All task routes require authentication
taskRoute.use(protect);

// Dashboard stats
taskRoute.get("/dashboard", getDashboardStats);

// RESTful task CRUD
taskRoute.route("/")
  .get(getTasks)
  .post(validate(createTaskSchema), createTask);

taskRoute.route("/:id")
  .get(getTaskById)
  .put(validate(updateTaskSchema), updateTask)
  .delete(deleteTask);

export default taskRoute;