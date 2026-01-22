import Doctor from "../../models/Doctor.js";
import bcrypt from "bcryptjs";

/* =========================
   جلب إعدادات الطبيب
========================= */
export const getDoctorSettings = async (req, res) => {
  const doctor = await Doctor.findById(req.doctor._id).select(
    "name email specialty"
  );

  res.json(doctor);
};

/* =========================
   تحديث الملف الشخصي
========================= */
export const updateDoctorProfile = async (req, res) => {
  const { name, specialty } = req.body;

  const doctor = await Doctor.findByIdAndUpdate(
    req.doctor._id,
    { name, specialty },
    { new: true }
  ).select("name email specialty");

  res.json(doctor);
};

/* =========================
   تغيير كلمة المرور
========================= */
export const changeDoctorPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const doctor = await Doctor.findById(req.doctor._id);

  const isMatch = await bcrypt.compare(currentPassword, doctor.password);
  if (!isMatch) {
    return res.status(400).json({ message: "كلمة المرور الحالية غير صحيحة" });
  }

  doctor.password = newPassword;
  await doctor.save(); // ← يتشفر تلقائي من الـ pre save

  res.json({ message: "تم تحديث كلمة المرور بنجاح" });
};
