import { Router } from "express";
import { getCenterDashboard } from "../../controllers/center/dashboard.controller.js";

const router = Router();

// لاحظي: ❌ بدون authCenter هنا
router.get("/", async (req, res, next) => {
  try {
    if (!req.centerId) {
      return res
        .status(403)
        .json({ message: "لا تمتلك صلاحية للوصول إلى هذه البيانات" });
    }

    await getCenterDashboard(req, res, next);
  } catch (error) {
    console.error("Dashboard route error:", error.message);
    res
      .status(500)
      .json({ message: "حدث خطأ غير متوقع في جلب بيانات لوحة القيادة" });
  }
});

export default router;
