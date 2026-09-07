import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Task from "../../models/tasks/TaskModel.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Escape special regex characters to prevent ReDoS attacks */
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Validate a MongoDB ObjectId, returning 400 if invalid */
const validateObjectId = (id, res) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ success: false, message: "Invalid task ID format" });
    return false;
  }
  return true;
};

// ─── GET DASHBOARD STATS ──────────────────────────────────────────────────────
export const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [statusAgg, priorityAgg, recentTasks] = await Promise.all([
    // Count by status
    Task.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),

    // Count by priority
    Task.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]),

    // 5 most recent tasks
    Task.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title status priority dueDate createdAt checklist"),
  ]);

  // Build normalized status counts
  const statusMap = { pending: 0, "in-progress": 0, completed: 0 };
  statusAgg.forEach(({ _id, count }) => {
    if (_id in statusMap) statusMap[_id] = count;
  });

  // Build normalized priority counts
  const priorityMap = { low: 0, medium: 0, high: 0 };
  priorityAgg.forEach(({ _id, count }) => {
    if (_id in priorityMap) priorityMap[_id] = count;
  });

  const totalTasks =
    statusMap.pending + statusMap["in-progress"] + statusMap.completed;

  return res.status(200).json({
    success: true,
    stats: {
      totalTasks,
      pending: statusMap.pending,
      inProgress: statusMap["in-progress"],
      completed: statusMap.completed,
      byPriority: priorityMap,
      byStatus: statusMap,
    },
    recentTasks,
  });
});

// ─── CREATE TASK ──────────────────────────────────────────────────────────────
export const createTask = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    startDate,
    dueDate,
    status,
    priority,
    assignedTo,
    checklist,
    attachments,
  } = req.body;

  const task = await Task.create({
    title,
    description,
    startDate,
    dueDate,
    status,
    priority,
    assignedTo,
    checklist,
    attachments,
    user: req.user._id,
  });

  // Populate assignedTo for response
  await task.populate("assignedTo", "name email photo");

  return res.status(201).json({
    success: true,
    message: "Task created successfully",
    task,
  });
});

// ─── GET ALL TASKS (with pagination, filtering, sorting, search) ──────────────
export const getTasks = asyncHandler(async (req, res) => {
  const {
    status,
    priority,
    search,
    sort = "createdAt",
    order = "desc",
    page = 1,
    limit = 20,
  } = req.query;

  // Build filter query — always scoped to current user
  const filter = { user: req.user._id };

  if (status && ["pending", "in-progress", "completed"].includes(status)) {
    filter.status = status;
  }

  if (priority && ["low", "medium", "high"].includes(priority)) {
    filter.priority = priority;
  }

  if (search && search.trim()) {
    filter.title = {
      $regex: escapeRegex(search.trim()),
      $options: "i",
    };
  }

  // Build sort object
  const allowedSortFields = ["createdAt", "dueDate", "priority", "title", "status"];
  const sortField = allowedSortFields.includes(sort) ? sort : "createdAt";
  const sortOrder = order === "asc" ? 1 : -1;
  const sortObj = { [sortField]: sortOrder };

  // Pagination
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [tasks, totalCount] = await Promise.all([
    Task.find(filter)
      .populate("assignedTo", "name email photo")
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Task.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,
    count: tasks.length,
    totalCount,
    totalPages: Math.ceil(totalCount / limitNum),
    currentPage: pageNum,
    tasks,
  });
});

// ─── GET TASK BY ID ───────────────────────────────────────────────────────────
export const getTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id, res)) return;

  const task = await Task.findOne({
    _id: id,
    user: req.user._id,
  }).populate("assignedTo", "name email photo");

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  return res.status(200).json({
    success: true,
    task,
  });
});

// ─── UPDATE TASK ──────────────────────────────────────────────────────────────
export const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id, res)) return;

  const task = await Task.findOne({ _id: id, user: req.user._id });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  // Only update fields that were provided
  const updatableFields = [
    "title",
    "description",
    "startDate",
    "dueDate",
    "status",
    "priority",
    "assignedTo",
    "checklist",
    "attachments",
  ];

  for (const field of updatableFields) {
    if (req.body[field] !== undefined) {
      task[field] = req.body[field];
    }
  }

  const updatedTask = await task.save();
  await updatedTask.populate("assignedTo", "name email photo");

  return res.status(200).json({
    success: true,
    message: "Task updated successfully",
    task: updatedTask,
  });
});

// ─── DELETE TASK ──────────────────────────────────────────────────────────────
export const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id, res)) return;

  const task = await Task.findOneAndDelete({
    _id: id,
    user: req.user._id,
  });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
});
