import jwt from "jsonwebtoken";

export default function authCenter(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "التوكن مفقود" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "التوكن غير صحيح، يجب أن يبدأ بـ 'Bearer '" });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "التوكن غير صالح أو انتهت صلاحيته" });
      }

      req.centerId = decoded.centerId || decoded.id;

      if (!req.centerId) {
        return res.status(401).json({ message: "التوكن لا يحتوي على centerId" });
      }

      next();
    });
  } catch (error) {
    return res.status(500).json({ message: "حدث خطأ غير متوقع أثناء التحقق من التوكن" });
  }
}
