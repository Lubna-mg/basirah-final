import api from "./axios";

/* =========================
   جلب الملاحظات
   ========================= */
export async function getNotes({ patientId } = {}) {
  const url = patientId
    ? `/doctor/notes?patientId=${patientId}`
    : `/doctor/notes`;

  const res = await api.get(url);
  return res.data;
}

/* =========================
   إضافة ملاحظة
   ========================= */
export async function createNote({ text, patientId }) {
  if (!text) {
    throw new Error("النص مطلوب");
  }

  const res = await api.post("/doctor/notes", {
    text,
    patientId,
  });

  return res.data;
}
