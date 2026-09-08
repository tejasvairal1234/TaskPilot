import { z } from "zod";

// Checklist item schema
const checklistItemSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Checklist item cannot be empty")
    .max(500, "Checklist item cannot exceed 500 characters"),
  completed: z.boolean().default(false),
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

const baseTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title cannot exceed 200 characters"),

  description: z
    .string()
    .trim()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional()
    .default(""),

  startDate: z.coerce
    .date({ error: "Invalid start date" })
    .optional(),

  dueDate: z.coerce
    .date({ error: "Invalid due date" })
    .nullable()
    .optional(),

  status: z.enum(["pending", "in-progress", "completed"]).optional().default("pending"),

  priority: z.enum(["low", "medium", "high"]).optional().default("low"),

  assignedTo: z
    .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"))
    .optional()
    .default([]),

  checklist: z.array(checklistItemSchema).optional().default([]),

  attachments: z.array(attachmentSchema).optional().default([]),
});

export const createTaskSchema = baseTaskSchema.refine(
  (data) => {
    if (!data.dueDate || !data.startDate) return true;
    return data.dueDate >= data.startDate;
  },
  {
    message: "Due date cannot be before start date",
    path: ["dueDate"],
  }
);

export const updateTaskSchema = baseTaskSchema
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
