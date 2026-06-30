import axios from "axios";

export const api = axios.create({
  baseURL: "https://relocation-companion-api.onrender.com/api/v1",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});