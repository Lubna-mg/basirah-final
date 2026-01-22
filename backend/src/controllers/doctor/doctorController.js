// src/controllers/doctor/doctorController.js

import Doctor from "../../models/Doctor.js";
import Center from "../../models/Center.js";

// ==========================
// GET /api/doctor/profile
// بيانات الدكتور الشخصية
// ==========================
export const getDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.doctorId; // من التوكن لاحقاً

    const doctor = await Doctor.findById(doctorId).populate("center", "name");
    if (!doctor) {
      return res.status(404).json({ message: "حساب الدكتور غير موجود" });
    }

    return res.json(doctor);
  } catch (err) {
    console.error("getDoctorProfile error:", err);
    return res.status(500).json({ message: "خطأ في جلب بيانات الدكتور" });
  }
};

// ==========================
// PUT /api/doctor/profile
// تحديث بيانات الدكتور
// ==========================
export const updateDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.doctorId;
    const { name, phone, specialty } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "حساب الدكتور غير موجود" });
    }

    if (name !== undefined) doctor.name = name;
    if (phone !== undefined) doctor.phone = phone;
    if (specialty !== undefined) doctor.specialty = specialty;

    await doctor.save();

    const updated = await Doctor.findById(doctorId).populate("center", "name");

    return res.json(updated);
  } catch (err) {
    console.error("updateDoctorProfile error:", err);
    return res
      .status(500)
      .json({ message: "حدث خطأ أثناء تحديث ملف الدكتور" });
  }
};

// ==========================
// GET /api/doctor/patients
// قائمة المرضى المرتبطين بالدكتور
// ==========================
export const getMyPatients = async (req, res) => {
  try {
    const doctorId = req.doctorId;

    // لاحقاً هنا نستدعي Model المرضى
    return res.json({
      message: "هنا سيتم جلب المرضى المرتبطين بالدكتور",
      doctorId,
    });
  } catch (err) {
    console.error("getMyPatients error:", err);
    return res.status(500).json({ message: "خطأ في جلب المرضى" });
  }
};

// ==========================
// GET /api/doctor/tests
// الفحوصات الخاصة بالدكتور
// ==========================
export const getDoctorTests = async (req, res) => {
  try {
    const doctorId = req.doctorId;

    // لاحقاً نربط Model الفحوصات
    return res.json({
      message: "هنا سيتم جلب فحوصات الدكتور",
      doctorId,
    });
  } catch (err) {
    console.error("getDoctorTests error:", err);
    return res.status(500).json({ message: "خطأ في جلب الفحوصات" });
  }
};

export default {
  getDoctorProfile,
  updateDoctorProfile,
  getMyPatients,
  getDoctorTests,
};
