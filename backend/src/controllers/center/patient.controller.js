import mongoose from "mongoose";
import Patient from "../../models/Patient.js";
import Doctor from "../../models/Doctor.js";
import { generateFileNumber } from "../../utils/generateFileNumber.js";

/* =========================
   GET /api/v1/center/patients
========================= */
export const getCenterPatients = async (req, res) => {
  try {
    const centerId = req.centerId;

    const patients = await Patient.find({ center: centerId })
      .populate("doctor", "name")
      .sort({ createdAt: -1 });

    res.json({ patients });
  } catch (error) {
    console.error("getCenterPatients error:", error);
    res.status(500).json({ message: "فشل جلب المرضى" });
  }
};

/* =========================
   POST /api/v1/center/patients
========================= */
export const createPatient = async (req, res) => {
  try {
    console.log("🟢 CENTER ID FROM TOKEN:", req.centerId);
    console.log("🟢 DOCTOR ID FROM BODY:", req.body.doctor);

    const centerId = req.centerId;
    const { name, age, gender, doctor } = req.body;

    // تحقق أساسي
    if (!name || !age || !gender || !doctor) {
      return res.status(400).json({
        message: "يرجى تعبئة جميع الحقول",
      });
    }

    // تحقق من ObjectId الطبيب
    if (!mongoose.Types.ObjectId.isValid(doctor)) {
      return res.status(400).json({
        message: "الطبيب المحدد غير صالح",
      });
    }

    // تحقق أن الطبيب موجود
    const doctorExists = await Doctor.findById(doctor);
    if (!doctorExists) {
      return res.status(400).json({
        message: "الطبيب غير موجود",
      });
    }

    // تأكد أن الطبيب تابع لنفس المركز
    if (doctorExists.center.toString() !== centerId) {
      return res.status(400).json({
        message: "الطبيب لا يتبع هذا المركز",
      });
    }

    // توليد رقم ملف آمن
    const file_number = await generateFileNumber(Patient, centerId);

    // إنشاء المريض
    const patient = await Patient.create({
      name,
      age,
      gender,
      doctor,
      center: centerId,
      file_number,
    });

    // إرجاع المريض مع اسم الطبيب
    const populatedPatient = await Patient.findById(patient._id)
      .populate("doctor", "name");

    res.status(201).json({ patient: populatedPatient });
  } catch (error) {
    console.error("createPatient error:", error);
    res.status(500).json({
      message: "فشل إضافة المريض",
    });
  }
};
