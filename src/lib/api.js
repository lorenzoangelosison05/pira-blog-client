import axios from "axios";
import { getAuth } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://pira-blog-exam.onrender.com"
});

api.interceptors.request.use((config) => {
  const { token } = getAuth();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
