import axios from "axios";

export const API_BASE =
  import.meta.env.VITE_API_URL || "https://aimroute.onrender.com";

const API = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
API.interceptors.request.use((request) => {
  const token = localStorage.getItem("token");

  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

export default API;