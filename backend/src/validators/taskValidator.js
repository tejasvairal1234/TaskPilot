import { z } from "zod";

// Checklist item schema
const checklistItemSchema = z
  .object({
    _id: z.any().optional(),
    text: z
      .string()
      .trim()
      .min(1, "Checklist item cannot be empty")
      .max(500, "Checklist item cannot exceed 500 characters")
      .optional(),
    title: z
      .string()
      .trim()
      .min(1, "Checklist item cannot be empty")
      .max(500, "Checklist item cannot exceed 500 characters")
      .optional(),
    completed: z.boolean().default(false),
  })
  .refine((data) => data.text !== undefined || data.title !== undefined, {
    message: "Checklist item text or title is required",
  });

// Attachment schema
const attachmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Attachment name is required")
    .max(200, "Attachment name cannot exceed 200 characters"),
  url: z.string().url("Attachment URL must be a valid URL"),
});

// Base task field definitions without defaults (for safe partial updates)
const taskFields = {
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title cannot exceed 200 characters"),

  description: z
    .string()
    .trim()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),

  startDate: z.coerce
    .date({ error: "Invalid start date" })
    .optional(),

  dueDate: z.coerce
    .date({ error: "Invalid due date" })
    .nullable()
    .optional(),

  status: z.enum(["pending", "in-progress", "completed"]).optional(),

  priority: z.enum(["low", "medium", "high"]).optional(),

  assignedTo: z
    .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"))
    .optional(),

  checklist: z.array(checklistItemSchema).optional(),

  attachments: z.array(attachmentSchema).optional(),
};

// Schema for creating tasks - provides initial defaults for creation
export const createTaskSchema = z
  .object({
    ...taskFields,
    description: taskFields.description.default(""),
    status: taskFields.status.default("pending"),
    priority: taskFields.priority.default("low"),
    assignedTo: taskFields.assignedTo.default([]),
    checklist: taskFields.checklist.default([]),
    attachments: taskFields.attachments.default([]),
  })
  .refine(
    (data) => {
      if (!data.dueDate || !data.startDate) return true;
      return data.dueDate >= data.startDate;
    },
    {
      message: "Due date cannot be before start date",
      path: ["dueDate"],
    }
  );

// Schema for updating tasks - strictly partial, no default values injected for omitted fields
export const updateTaskSchema = z
  .object(taskFields)
  .partial()
  .refine(
    (data) => {
      if (!data.dueDate || !data.startDate) return true;
      return data.dueDate >= data.startDate;
    },
    {
      message: "Due date cannot be before start date",
      path: ["dueDate"],
    }
  );
