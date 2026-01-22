import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
});

/**
 * إرسال أي توكن موجود تلقائيًا
 * (Admin / Center / Doctor)
 */
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("adminToken") ||
      localStorage.getItem("centerToken") ||
      localStorage.getItem("doctorToken") ||
      localStorage.getItem("token"); // دعم قديم

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
