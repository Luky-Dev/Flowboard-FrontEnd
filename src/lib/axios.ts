import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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