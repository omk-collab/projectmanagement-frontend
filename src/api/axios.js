import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // zaruri hai - httpOnly cookies bhejne/receive karne ke liye
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
