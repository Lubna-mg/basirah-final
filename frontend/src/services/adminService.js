import api from "./api";

// جلب المستخدمين (مثال)
export const getAdminUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data;
};
