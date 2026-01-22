import mongoose from "mongoose";
import Patient from "../../models/Patient.js";
import Doctor from "../../models/Doctor.js";

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
   ✅ حل مؤقت (بدون ربط الطبيب بالمركز)
========================= */
export const createPatient = async (req, res) => {
  try {
    const centerId = req.centerId;
    const { name, age, gender, doctor } = req.body;

    // تحقق أساسي
    if (!name || !age || !gender || !doctor) {
      return res.status(400).json({
        message: "يرجى تعبئة جميع الحقول",
      });
    }

    // تحقق من ObjectId
    if (!mongoose.Types.ObjectId.isValid(doctor)) {
      return res.status(400).json({
        message: "الطبيب المحدد غير صالح",
      });
    }

    // ✅ تحقق مؤقت: الطبيب موجود فقط (بدون center)
    const doctorExists = await Doctor.findById(doctor);

    if (!doctorExists) {
      return res.status(400).json({
        message: "الطبيب غير موجود",
      });
    }

    // توليد رقم ملف خاص بالمركز
    const count = await Patient.countDocuments({ center: centerId });
    const file_number = `P-${String(count + 1).padStart(4, "0")}`;

    const patient = await Patient.create({
      name,
      age,
      gender,
      doctor,          // ObjectId
      center: centerId, // ربط المريض بالمركز
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
