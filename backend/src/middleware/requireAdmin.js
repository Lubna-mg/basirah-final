export default function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "غير مصرح" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ اعتبري أي توكن أدمن هو أدمن
    req.adminId = decoded.id || decoded.adminId;
    next();
  } catch {
    return res.status(403).json({ message: "توكن غير صالح" });
  }
}
