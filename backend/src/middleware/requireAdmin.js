import jwt from "jsonwebtoken";

export default function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "غير مصرح" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ تأكيد الدور
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "ليس أدمن" });
    }

    // ✅ مرونة في قراءة الـ id
    req.adminId = decoded.id || decoded.adminId;

    next();
  } catch (error) {
    return res.status(403).json({ message: "توكن غير صالح" });
  }
}
