import Patient from "../../models/Patient.js";

/* =========================
   جلب مرضى الطبيب (من مركزه)
========================= */
export const getMyPatients = async (req, res) => {
  try {
    if (!req.doctor?.center) {
      return res.status(400).json({
        message: "الطبيب غير مرتبط بمركز",
      });
    }

    const patients = await Patient.find({
      center: req.doctor.center, // ✅ المرضى من نفس المركز
    }).sort({ createdAt: -1 });

    res.json(patients);
  } catch (error) {
    console.error("getMyPatients error:", error);
    res.status(500).json({ message: "فشل تحميل المرضى" });
  }
};

/* =========================
   إضافة مريض جديد (ممنوعة للطبيب)
========================= */
export const createPatient = async (req, res) => {
  return res.status(403).json({
    message:
      "إضافة المرضى تتم من خلال إدارة المركز فقط",
  });
};

/* =========================
   جلب بيانات مريض واحد
========================= */
export const getPatientById = async (req, res) => {
  try {
    if (!req.doctor?.center) {
      return res.status(400).json({
        message: "الطبيب غير مرتبط بمركز",
      });
    }

    const patient = await Patient.findOne({
      _id: req.params.id,
      center: req.doctor.center, // ✅ تأكيد أنه من نفس المركز
    });

    if (!patient) {
      return res.status(404).json({ message: "المريض غير موجود" });
    }

    res.json(patient);
  } catch (error) {
    console.error("getPatientById error:", error);
    res.status(500).json({ message: "فشل جلب بيانات المريض" });
  }
};
