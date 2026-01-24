import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Center from "../../models/Center.js";

/* =======================
   تسجيل دخول المركز
======================= */
export async function loginCenter(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "يرجى إدخال البريد الإلكتروني وكلمة المرور.",
      });
    }

    // جلب المركز مع كلمة المرور + flag
    const center = await Center
      .findOne({ email })
      .select("+password +mustChangePassword");

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

    // 🔐 حساب جديد → إجبار تغيير كلمة المرور
    if (center.mustChangePassword) {
      return res.status(403).json({
        message: "MUST_CHANGE_PASSWORD",
        centerId: center._id,
      });
    }

    // إنشاء التوكن
    const token = jwt.sign(
      {
        centerId: center._id,
        role: "center",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      center: {
        id: center._id,
        name: center.name,
        email: center.email,
        city: center.city,
        status: center.status,
        subscriptionPlan: center.subscriptionPlan,
      },
    });
  } catch (err) {
    console.error("loginCenter error:", err);
    return res.status(500).json({
      message: "فشل تسجيل الدخول، يرجى المحاولة لاحقًا.",
    });
  }
}

/* =======================
   تغيير كلمة المرور (أول دخول)
======================= */
export async function changeCenterPassword(req, res) {
  try {
    const { centerId, newPassword } = req.body;

    if (!centerId || !newPassword) {
      return res.status(400).json({
        message: "البيانات غير مكتملة.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل.",
      });
    }

    const center = await Center
      .findById(centerId)
      .select("+password +mustChangePassword");

    if (!center) {
      return res.status(404).json({
        message: "المركز غير موجود.",
      });
    }

    // تشفير كلمة المرور الجديدة
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    center.password = hashedPassword;
    center.mustChangePassword = false;

    await center.save();

    return res.json({
      message: "تم تغيير كلمة المرور بنجاح.",
    });
  } catch (err) {
    console.error("changeCenterPassword error:", err);
    return res.status(500).json({
      message: "فشل تغيير كلمة المرور.",
    });
  }
}
