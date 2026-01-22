import { Router } from "express";
import authCenter from "../../middleware/authCenter.js";  // تحقق من صلاحية التوكن
import { getCenterDashboard } from "../../controllers/center/dashboard.controller.js";  // جلب بيانات لوحة القيادة

const router = Router();

// إضافة المسار للوصول إلى لوحة القيادة
router.get("/", authCenter, async (req, res, next) => {
  try {
    // تحقق من صلاحيات الوصول (إذا كانت هناك حاجة لهذا التحقق)
    if (!req.centerId) {
      return res.status(403).json({ message: "لا تمتلك صلاحية للوصول إلى هذه البيانات" });
    }

    // تمرير الطلب إلى الدالة المسؤولة عن جلب بيانات لوحة القيادة
    await getCenterDashboard(req, res, next);
  } catch (error) {
    // التعامل مع الأخطاء في حالة حدوث أي مشكلة
    console.error("Dashboard route error:", error.message);
    res.status(500).json({ message: "حدث خطأ غير متوقع في جلب بيانات لوحة القيادة" });
  }
});

export default router;
