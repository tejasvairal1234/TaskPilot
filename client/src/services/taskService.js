import api from "../api/axiosInstance.js";

export const taskService = {
  // Dashboard
  getDashboardStats: () => api.get("/tasks/dashboard"),

  // CRUD
  getTasks: (params = {}) => api.get("/tasks", { params }),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  createTask: (data) => api.post("/tasks", data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};
