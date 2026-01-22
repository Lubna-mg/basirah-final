import Doctor from "../../models/Doctor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * POST /api/v1/doctor/auth/login
 */
export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ تحقق من وجود الإيميل
    const doctor = await Doctor.findOne({ email }).select("+password");
    if (!doctor) {
      return res.status(401).json({
        message: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      });
    }

    // 2️⃣ تحقق من كلمة المرور
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      });
    }

    // 3️⃣ إنشاء JWT
    const token = jwt.sign(
      {
        id: doctor._id,
        role: "doctor",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4️⃣ رجوع البيانات
    res.json({
      message: "تم تسجيل الدخول بنجاح",
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        center: doctor.center,
      },
    });
  } catch (error) {
    console.error("Doctor login error:", error);
    res.status(500).json({ message: "خطأ في السيرفر" });
  }
};
