import Session from "../../models/Session.js";
import Doctor from "../../models/Doctor.js";
import Patient from "../../models/Patient.js";

/**
 * GET /api/v1/center/sessions
 * جلب جلسات المركز
 */
export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ center: req.centerId })
      .populate("doctor", "name")
      .populate("patient", "name")
      .lean();

    // نرجع مصفوفة فاضية بدل 404 عشان ما ينكسر الفرونت
    res.json(sessions || []);
  } catch (error) {
    console.error("getSessions error:", error);
    res.status(500).json({
      message: "فشل في جلب الجلسات.",
    });
  }
};

/**
 * POST /api/v1/center/sessions
 * إنشاء جلسة جديدة
 */
export const createSession = async (req, res) => {
  try {
    const { doctor, patient, sessionDate, status } = req.body;

    // التحقق من المدخلات
    if (!doctor || !patient || !sessionDate) {
      return res.status(400).json({
        message: "يجب تحديد الطبيب، المريض، وتاريخ الجلسة.",
      });
    }

    // التحقق من الطبيب والمريض
    const validDoctor = await Doctor.findById(doctor);
    if (!validDoctor) {
      return res.status(404).json({ message: "الطبيب غير موجود." });
    }

    const validPatient = await Patient.findById(patient);
    if (!validPatient) {
      return res.status(404).json({ message: "المريض غير موجود." });
    }

    const session = new Session({
      doctor,
      patient,
      sessionDate,
      status: status || "قيد الانتظار",
      center: req.centerId,
    });

    await session.save();

    res.status(201).json({
      message: "تم إضافة الجلسة بنجاح.",
      session,
    });
  } catch (error) {
    console.error("createSession error:", error);
    res.status(400).json({
      message: "فشل في إضافة الجلسة.",
    });
  }
};

