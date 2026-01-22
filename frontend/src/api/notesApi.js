import api from "./axios";

/**
 * جلب جميع الملاحظات الخاصة بالطبيب
 */
export const fetchDoctorNotes = async () => {
  const res = await api.get("/doctor/notes");
  return res.data;
};

/**
 * إضافة ملاحظة (بدون مريض محدد)
 */
export const createDoctorNote = async (text) => {
  const res = await api.post("/doctor/notes", { text });
  return res.data;
};

/**
 * إضافة ملاحظة لمريض معيّن
 */
export const createPatientNote = async (patientId, text) => {
  const res = await api.post(`/doctor/notes/${patientId}`, { text });
  return res.data;
};
