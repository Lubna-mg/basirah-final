import Appointment from "../../models/Appointment.js";
import Doctor from "../../models/Doctor.js";
import Patient from "../../models/Patient.js";

/**
 * ============================
 * جلب مواعيد المركز
 * GET /api/v1/center/appointments
 * ============================
 */
export const getCenterAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      center: req.centerId,
    })
      .populate("doctor", "name")
      .populate("patient", "name")
      .sort({ date: 1 })
      .lean();

    res.json({ appointments });
  } catch (err) {
    console.error("getCenterAppointments error:", err);
    res.status(500).json({ message: "فشل جلب المواعيد" });
  }
};

/**
 * ============================
 * إنشاء موعد جديد
 * POST /api/v1/center/appointments
 * ============================
 */
export const createAppointment = async (req, res) => {
  try {
    const { doctor, patient, date, notes } = req.body;

    if (!doctor || !patient || !date) {
      return res.status(400).json({
        message: "الطبيب، المريض، والتاريخ مطلوبة",
      });
    }

    // التحقق من الطبيب
    const doctorExists = await Doctor.findById(doctor);
    if (!doctorExists) {
      return res.status(400).json({ message: "الطبيب غير موجود" });
    }

    // التحقق من المريض
    const patientExists = await Patient.findById(patient);
    if (!patientExists) {
      return res.status(400).json({ message: "المريض غير موجود" });
    }

    // إنشاء الموعد
    const appointment = await Appointment.create({
      center: req.centerId,
      doctor,
      patient,
      date,
      notes,
    });

    // ✅ إعادة الموعد مع populate (الحل الأساسي)
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("doctor", "name")
      .populate("patient", "name");

    res.status(201).json({
      message: "تم إنشاء الموعد بنجاح",
      appointment: populatedAppointment,
    });
  } catch (err) {
    console.error("createAppointment error:", err);

    if (err.code === 11000) {
      return res.status(400).json({
        message: "هذا الطبيب لديه موعد في نفس الوقت",
      });
    }

    res.status(500).json({ message: "فشل إنشاء الموعد" });
  }
};

/**
 * ============================
 * تحديث حالة الموعد
 * PUT /api/v1/center/appointments/:id
 * ============================
 */
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, center: req.centerId },
      { status },
      { new: true }
    )
      .populate("doctor", "name")
      .populate("patient", "name");

    if (!appointment) {
      return res.status(404).json({ message: "الموعد غير موجود" });
    }

    res.json({
      message: "تم تحديث حالة الموعد",
      appointment,
    });
  } catch (err) {
    console.error("updateAppointmentStatus error:", err);
    res.status(500).json({ message: "فشل تحديث الموعد" });
  }
};
