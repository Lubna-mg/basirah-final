import api from "./axios";

// جلب جميع مرضى الطبيب
export async function getPatients() {
  const res = await api.get("/doctor/patients")
  return res.data;
}

// إضافة مريض جديد
export async function addPatient(newPatient) {
  const res = await api.post("/v1/doctor/patients", newPatient);
  return res.data;
}
