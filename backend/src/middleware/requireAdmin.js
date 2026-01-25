import jwt from "jsonwebtoken";

export default function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "غير مصرح" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ التأكد من أن التوكن يحتوي على دور "admin"
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "ليس أدمن" });
    }

    req.adminId = decoded.id; // أو يمكنك استخدام decoded.adminId إذا كان هناك
    next();
  } catch (error) {
    return res.status(403).json({ message: "توكن غير صالح" });
  }
}
