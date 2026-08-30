import { z } from "zod";

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
    .optional(),

  startDate: z.coerce
    .date({
      error: "Invalid start date",
    })
    .optional(),

  endDate: z.coerce
    .date({
      error: "Invalid end date",
    })
    .nullable()
    .optional(),

  status: z.enum(["pending", "in-progress", "completed"]).optional(),

  priority: z.enum(["low", "medium", "high"]).optional(),
});

export const createTaskSchema = baseTaskSchema.refine(
  (data) => {
    if (!data.endDate || !data.startDate) return true;

    return data.endDate >= data.startDate;
  },
  {
    message: "End date cannot be before start date",
    path: ["endDate"],
  },
);
