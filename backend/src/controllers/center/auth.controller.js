
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Center from "../../models/Center.js"; // ✅ هذا السطر هو الحل

export async function loginCenter(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "يرجى إدخال البريد الإلكتروني وكلمة المرور.",
      });
    }

    const center = await Center
      .findOne({ email })
      .select("+password");

    if (!center) {
      return res.status(401).json({
        message: "بيانات الدخول غير صحيحة.",
      });
    }

    const isMatch = await bcrypt.compare(password, center.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "بيانات الدخول غير صحيحة.",
      });
    }

    const token = jwt.sign(
      { centerId: center._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      center: {
        id: center._id,
        name: center.name,
        email: center.email,
      },
    });
  } catch (err) {
    console.error("loginCenter error:", err);
    res.status(500).json({
      message: "فشل تسجيل الدخول، يرجى المحاولة لاحقًا.",
    });
  }
}
