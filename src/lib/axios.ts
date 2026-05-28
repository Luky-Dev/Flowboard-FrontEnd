import axios from "axios";

export const api = axios.create({
  baseURL: "https://flowboard-backend-djwy.onrender.com",
});

api.interceptors.request.use((config) => {
  const storage = localStorage.getItem("auth-storage");

  if (storage) {
    const parsed = JSON.parse(storage);

    const token = parsed.state.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});
