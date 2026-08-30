import asyncHandler from "express-async-handler";
import Task from "../../models/tasks/TaskModel.js";

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, status, completed, priority } = req.body;

  // Validate title
  if (!title || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "Please provide a title",
    });
  }

  // Create task
  const task = await Task.create({
    title: title.trim(),
    description,
    dueDate,
    status,
    completed,
    priority,

    // Logged in user
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

  if (!tasks) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  return res.status(200).json({
    success: true,
    tasks,
  });
});

export const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { title, description, dueDate, status, completed, priority } = req.body;

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
    if (!title.trim()) {
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

  if (dueDate !== undefined) {
    task.dueDate = dueDate;
  }

  if (status !== undefined) {
    task.status = status;
  }

  if (completed !== undefined) {
    task.completed = completed;
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
