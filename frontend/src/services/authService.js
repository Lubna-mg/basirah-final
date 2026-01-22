import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1/admin/auth`;

/**
 * تسجيل دخول الأدمن
 */
export const loginAdmin = async (email, password) => {
  const res = await axios.post(`${BASE_URL}/login`, {
    email: email.trim(),
    password: password.trim(),
  });

  // ✅ تخزين موحّد
  localStorage.setItem("adminToken", res.data.token);
  localStorage.setItem("adminInfo", JSON.stringify(res.data.admin));

  return res.data;
};

/**
 * تسجيل خروج الأدمن
 */
export const logoutAdmin = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminInfo");
};
