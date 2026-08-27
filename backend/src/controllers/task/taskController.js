import asyncHandler from "express-async-handler";

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
