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
