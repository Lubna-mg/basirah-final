import { Router } from "express";
import { loginCenter } from "../../controllers/center/auth.controller.js";
import { body, validationResult } from "express-validator"; // للتحقق من صحة المدخلات

const router = Router();

// إضافة التحقق من المدخلات
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("البريد الإلكتروني غير صالح"),
    body("password").notEmpty().withMessage("كلمة المرور مطلوبة"),
  ],
  async (req, res, next) => {
    // التحقق من الأخطاء في المدخلات
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // توجيه الطلب إلى loginCenter بعد التحقق من المدخلات
      await loginCenter(req, res);
    } catch (error) {
      next(error);  // في حال وجود أي خطأ، نمرره إلى الـ errorHandler
    }
  }
);

export default router;
