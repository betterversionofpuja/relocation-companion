import axios from "axios";

export const api = axios.create({
  baseURL: "https://relocation-companion-api.onrender.com/api/v1",
  withCredentials: true,
});