import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

// Add token to requests if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const register = (formData) => API.post("/auth/register", formData);
export const login = (formData) => API.post("/auth/login", formData);
export const getUserProfile = () => API.get("/auth/user");

// Organization endpoints
export const createInvitation = (email, role) =>
  API.post("/auth/invite", { email, role });
export const getOrganizationMembers = () => API.get("/auth/members");
export const updateUserRole = (userId, role) =>
  API.patch(`/auth/users/${userId}/role`, { role });
export const removeUserFromOrg = (userId) =>
  API.delete(`/auth/users/${userId}`);

// Task endpoints
export const createTask = (taskData) => API.post("/tasks", taskData);
export const getAllTasks = () => API.get("/tasks");
export const getTaskById = (taskId) => API.get(`/tasks/${taskId}`);
export const updateTask = (taskId, taskData) =>
  API.patch(`/tasks/${taskId}`, taskData);
export const deleteTask = (taskId) => API.delete(`/tasks/${taskId}`);
export const getMyTasks = () => API.get("/tasks/my/tasks");
export const getMyNotifications = () => API.get("/tasks/my/notifications");
export const markNotificationsAsRead = (taskId) =>
  API.patch(`/tasks/notifications/${taskId}`);
