import { Router } from "express";
import authCenter from "../../middleware/authCenter.js";
import { body, validationResult } from "express-validator";
import {
  getCenterDoctors,
  addCenterDoctor,
} from "../../controllers/center/doctor.controller.js";

const router = Router();

/**
 * /api/v1/center/doctors
 */

// جلب أطباء المركز
router.get("/", authCenter, getCenterDoctors);

// إضافة طبيب جديد
router.post(
  "/",
  authCenter,
  [
    body("name").notEmpty().withMessage("اسم الطبيب مطلوب"),
    body("email").isEmail().withMessage("البريد الإلكتروني غير صالح"),
    body("password")
      .notEmpty()
      .withMessage("كلمة المرور مطلوبة"),
    body("specialty")
      .notEmpty()
      .withMessage("التخصص مطلوب"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "بيانات غير صالحة",
        errors: errors.array(),
      });
    }

    // تمرير الطلب للكنترولر
    return addCenterDoctor(req, res, next);
  }
);

export default router;
