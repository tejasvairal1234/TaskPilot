import asyncHandler from "express-async-handler";
import Task from "../../models/tasks/TaskModel.js";

export const createTask = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    startDate,
    endDate,
    status,
    priority,
  } = req.body;

  const task = await Task.create({
    title,
    description,
    startDate,
    endDate,
    status,
    priority,
    user: req.user._id,
  });

  return res.status(201).json({
    success: true,
    message: "Task created successfully",
    task,
  });
});

export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({
    user: req.user._id,
  }).sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    count: tasks.length,
    tasks,
  });
});

export const getTaskByTitle = asyncHandler(async (req, res) => {
  const { title } = req.query;

  if (!title || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "Task title is required",
    });
  }

  const tasks = await Task.find({
    user: req.user._id,
    title: {
      $regex: title.trim(),
      $options: "i",
    },
  });

  if (tasks.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  return res.status(200).json({
    success: true,
    count: tasks.length,
    tasks,
  });
});

export const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    title,
    description,
    startDate,
    endDate,
    status,
    priority,
  } = req.body;

  // Find task belonging to logged-in user
  const task = await Task.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  // Update only provided fields
  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title cannot be empty",
      });
    }

    task.title = title.trim();
  }

  if (description !== undefined) {
    task.description = description;
  }

  if (startDate !== undefined) {
    task.startDate = startDate;
  }

  if (endDate !== undefined) {
    task.endDate = endDate;
  }

  if (status !== undefined) {
    task.status = status;
  }

  if (priority !== undefined) {
    task.priority = priority;
  }

  const updatedTask = await task.save();

  return res.status(200).json({
    success: true,
    message: "Task updated successfully",
    task: updatedTask,
  });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find task belonging to logged-in user
  const task = await Task.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  await Task.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
});
