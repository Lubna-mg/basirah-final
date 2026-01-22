import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
});

api.interceptors.request.use(
  (config) => {
    // 🔐 نختار التوكن حسب الموجود
    const token =
      localStorage.getItem("centerToken") ||
      localStorage.getItem("adminToken") ||
      localStorage.getItem("doctorToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
