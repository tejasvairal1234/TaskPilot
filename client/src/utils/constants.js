export const STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
};

export const PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

export const STATUS_LABELS = {
  pending: "Pending",
  "in-progress": "In Progress",
  completed: "Completed",
};

export const PRIORITY_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const STATUS_COLORS = {
  pending: {
    text: "text-purple-700 dark:text-purple-300",
    bg: "bg-purple-50 dark:bg-purple-950/40",
    border: "border-purple-200 dark:border-purple-800/50",
    dot: "bg-purple-500",
    hex: "#a855f7",
  },
  "in-progress": {
    text: "text-sky-700 dark:text-sky-300",
    bg: "bg-sky-50 dark:bg-sky-950/40",
    border: "border-sky-200 dark:border-sky-800/50",
    dot: "bg-sky-500",
    hex: "#0ea5e9",
  },
  completed: {
    text: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-800/50",
    dot: "bg-emerald-500",
    hex: "#22c55e",
  },
};

export const PRIORITY_COLORS = {
  low: {
    text: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-800/50",
    dot: "bg-emerald-500",
    hex: "#22c55e",
  },
  medium: {
    text: "text-orange-700 dark:text-orange-300",
    bg: "bg-orange-50 dark:bg-orange-950/40",
    border: "border-orange-200 dark:border-orange-800/50",
    dot: "bg-orange-500",
    hex: "#f97316",
  },
  high: {
    text: "text-red-700 dark:text-red-300",
    bg: "bg-red-50 dark:bg-red-950/40",
    border: "border-red-200 dark:border-red-800/50",
    dot: "bg-red-500",
    hex: "#ef4444",
  },
};

export const COLUMNS = [
  { id: STATUS.PENDING, label: "Pending", color: "purple" },
  { id: STATUS.IN_PROGRESS, label: "In Progress", color: "sky" },
  { id: STATUS.COMPLETED, label: "Completed", color: "emerald" },
];
