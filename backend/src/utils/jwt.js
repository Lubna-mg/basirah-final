import jwt from "jsonwebtoken";

// دالة لإنشاء التوكن
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d", // مدة صلاحية التوكن
  });
};

// دالة للتحقق من صحة التوكن
export const verifyToken = (token) => {
  try {
    // التحقق من صحة التوكن
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    // التعامل مع الأخطاء في حالة التوكن غير صالح أو منتهي
    if (error.name === "TokenExpiredError") {
      throw new Error("التوكن منتهي الصلاحية");
    }
    throw new Error("التوكن غير صالح");
  }
};
