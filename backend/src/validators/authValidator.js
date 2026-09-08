import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters"),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please provide a valid email"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password cannot exceed 100 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email"),

  password: z.string().min(1, "Password is required"),
});

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters")
      .optional(),

    currentPassword: z.string().optional(),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(100, "Password cannot exceed 100 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      )
      .optional(),

    confirmNewPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // If changing password, require currentPassword
      if (data.newPassword && !data.currentPassword) return false;
      return true;
    },
    { message: "Current password is required to set a new password", path: ["currentPassword"] }
  )
  .refine(
    (data) => {
      // If changing password, confirmNewPassword must match
      if (data.newPassword && data.newPassword !== data.confirmNewPassword)
        return false;
      return true;
    },
    { message: "New passwords do not match", path: ["confirmNewPassword"] }
  );