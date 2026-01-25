import jwt from "jsonwebtoken";

export default function authCenter(req, res, next) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

console.log("🔑 decoded token:", decoded);

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "غير مصرح" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /**
     * ✅ حل مؤقت مضمون
     * - يقبل أي توكن فيه id
     * - ما ينهار لو كان centerId غير موجود
     * - يمنع 400 في إنشاء المرضى
     */
    const centerId = decoded.centerId || decoded.id;

    if (!centerId) {
      return res.status(401).json({
        message: "لا يمكن تحديد المركز من التوكن",
      });
    }

    // ⭐⭐ أهم سطر
    req.centerId = centerId;

    next();
  } catch (error) {
    console.error("authCenter error:", error);
    return res.status(401).json({
      message: "توكن غير صالح أو منتهي",
    });
  }
}
