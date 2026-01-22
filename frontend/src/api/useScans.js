import api from "./axios";

// جلب جميع فحوصات الطبيب
export async function getDoctorScans() {
  const res = await api.get("/doctor/tests");
  return res.data;
}
