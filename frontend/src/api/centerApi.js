import axios from "axios";

const centerApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
});

centerApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("centerToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default centerApi;
