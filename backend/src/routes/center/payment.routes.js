// src/routes/payment.routes.js
import { Router } from "express";
import authCenter from "../../middleware/authCenter.js";  // تحقق من التوكن وصلاحية المركز
import { getCenterPayments } from "../../controllers/payment.controller.js";  // دالة جلب المدفوعات

const router = Router();

// مسار جلب المدفوعات للمركز
router.get("/", authCenter, async (req, res) => {
  try {
    // التحقق من وجود `centerId` في التوكن الذي تم التحقق منه في `authCenter`
    if (!req.centerId) {
      return res.status(403).json({ message: "لا تمتلك صلاحية للوصول إلى المدفوعات" });
    }

    // استدعاء دالة جلب المدفوعات من `getCenterPayments`
    await getCenterPayments(req, res);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب المدفوعات" });
  }
});

export default router;
