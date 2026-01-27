import jwt from "jsonwebtoken";

export default function authCenter(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "التوكن مفقود" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "التوكن غير صحيح، يجب أن يبدأ بـ Bearer" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /**
     * 🔥 استخراج centerId بشكل صريح
     * ندعم كل الصيغ المحتملة
     */
    const centerId =
      decoded.centerId ||
      decoded.center ||
      decoded._id ||
      decoded.id;

    if (!centerId) {
      return res
        .status(401)
        .json({ message: "التوكن لا يحتوي على centerId" });
    }

    // نثبّت القيمة
    req.centerId = centerId;

    next();
  } catch (err) {
    console.error("authCenter error:", err);
    return res
      .status(401)
      .json({ message: "التوكن غير صالح أو انتهت صلاحيته" });
  }
}
