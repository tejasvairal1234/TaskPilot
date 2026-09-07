import mongoose from "mongoose";

// ─── Checklist Item Subdocument ───────────────────────────────────────────────
const checklistItemSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Checklist item text is required"],
      trim: true,
      maxlength: [500, "Checklist item cannot exceed 500 characters"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

// ─── Attachment Subdocument ───────────────────────────────────────────────────
const attachmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Attachment name is required"],
      trim: true,
      maxlength: [200, "Attachment name cannot exceed 200 characters"],
    },
    url: {
      type: String,
      required: [true, "Attachment URL is required"],
    },
  },
  { _id: true }
);

// ─── Task Schema ──────────────────────────────────────────────────────────────
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    description: {
      type: String,
      default: "",
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    startDate: {
      type: Date,
      default: () => new Date(),
    },

    dueDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: {
        values: ["pending", "in-progress", "completed"],
        message: "Status must be pending, in-progress, or completed",
      },
      default: "pending",
    },

    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "Priority must be low, medium, or high",
      },
      default: "low",
    },

    // Owner of the task
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Team members assigned to this task
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    checklist: [checklistItemSchema],

    attachments: [attachmentSchema],

    // Demo data tracking
    isDemo: {
      type: Boolean,
      default: false,
      index: true,
    },

    demoKey: {
      type: String,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ user: 1, createdAt: -1 });
taskSchema.index({ title: "text" }); // Full-text search index

const Task = mongoose.model("Task", taskSchema);

export default Task;