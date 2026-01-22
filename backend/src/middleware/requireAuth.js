import jwt from "jsonwebtoken";
import { requireAuth } from "./middleware/requireAuth";


export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // التأكد من وجود التوكن في الـ headers
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: التوكن مفقود أو غير صحيح" });
  }

  try {
    // استخراج التوكن
    const token = authHeader.split(" ")[1];
    
    // التحقق من صحة التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // إضافة البيانات المفككة من التوكن إلى req
    req.user = decoded;
    
    // المرور إلى الدالة التالية في السلسلة
    next();
  } catch (error) {
    // إذا حدث خطأ أثناء التحقق من التوكن
    return res.status(401).json({ message: "Invalid token: التوكن غير صالح" });
  }
};
