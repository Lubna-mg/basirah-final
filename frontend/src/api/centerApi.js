import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
});

// 🔐 Interceptor خاص بالمركز فقط
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("centerToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
