/**
 * Format a date string/Date object for display.
 * Returns "—" if no date is provided.
 */
export const formatDate = (date, options = {}) => {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      ...options,
    });
  } catch {
    return "—";
  }
};

/**
 * Format date for HTML date inputs (YYYY-MM-DD).
 */
export const formatDateInput = (date) => {
  if (!date) return "";
  try {
    return new Date(date).toISOString().split("T")[0];
  } catch {
    return "";
  }
};

/**
 * Get a greeting based on current hour.
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

/**
 * Extract a readable error message from an Axios error.
 */
export const getErrorMessage = (error) => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.errors?.[0]?.message)
    return error.response.data.errors[0].message;
  if (error?.message) return error.message;
  return "Something went wrong. Please try again.";
};

/**
 * Compute checklist completion percentage.
 */
export const getChecklistProgress = (checklist = []) => {
  if (!checklist.length) return 0;
  const done = checklist.filter((item) => item.completed).length;
  return Math.round((done / checklist.length) * 100);
};

/**
 * Check if a task is overdue.
 */
export const isOverdue = (task) => {
  if (!task.dueDate || task.status === "completed") return false;
  return new Date(task.dueDate) < new Date();
};

/**
 * Get first name from full name.
 */
export const getFirstName = (name = "") => name.split(" ")[0];

/**
 * Generate avatar initials from name.
 */
export const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
