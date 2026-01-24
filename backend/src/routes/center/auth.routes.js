import { Router } from "express";
import {
  loginCenter,
  changeCenterPassword,
} from "../../controllers/center/auth.controller.js";
import { body, validationResult } from "express-validator";

const router = Router();

/* =======================
   تسجيل دخول المركز
======================= */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("البريد الإلكتروني غير صالح"),
    body("password").notEmpty().withMessage("كلمة المرور مطلوبة"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      await loginCenter(req, res);
    } catch (error) {
      next(error);
    }
  }
);

/* =======================
   تغيير كلمة المرور (أول دخول)
======================= */
router.post(
  "/change-password",
  [
    body("centerId")
      .notEmpty()
      .withMessage("معرّف المركز مطلوب"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      await changeCenterPassword(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
