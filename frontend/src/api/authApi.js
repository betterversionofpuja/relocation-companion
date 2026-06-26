import { api } from "./axios";

export const registerUser = async (userData) => {
  const response = await api.post("/users/register", userData);
  return response.data.data;
};

export const loginUser = async (userData) => {
  const response = await api.post("/users/login", userData);
  return response.data.data;
};

export const logoutUser = async () => {
  const response = await api.post("/users/logout");
  return response.data.data;
};

export const refreshAccessToken = async () => {
  const response = await api.post("/users/refresh-token");
  return response.data.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/users/profile");
  return response.data.data;
};

export const updateProfile = async (userData) => {
  const response = await api.put("/users/profile", userData);
  return response.data.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.post("/users/change-password", passwordData);
  return response.data.data;
};