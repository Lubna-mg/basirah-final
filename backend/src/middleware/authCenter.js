import jwt from "jsonwebtoken";

export default function authCenter(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "غير مصرح" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const centerId = decoded.centerId;

    if (!centerId) {
      return res.status(401).json({ message: "توكن غير صالح" });
    }

    req.centerId = centerId;
    next();
  } catch (error) {
    console.error("authCenter error:", error);
    return res.status(401).json({ message: "توكن غير صالح" });
  }
}
