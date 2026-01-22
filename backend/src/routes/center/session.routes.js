// src/routes/center/session.routes.js
import express from "express";
import { body, validationResult } from "express-validator";  // للتحقق من المدخلات
import {
  getSessions,
  createSession,
} from "../../controllers/center/session.controller.js";

import authCenter from "../../middleware/authCenter.js";  // التحقق من صلاحية التوكن

const router = express.Router();

/**
 * GET /api/v1/center/sessions
 * جلب جلسات المركز
 */
router.get("/", authCenter, getSessions);

/**
 * POST /api/v1/center/sessions
 * إنشاء جلسة جديدة للمركز
 */
router.post(
  "/",
  authCenter,  // التأكد من صلاحية التوكن
  [
    body("patientId").notEmpty().withMessage("معرف المريض مطلوب"), // تحقق من وجود patientId
    body("doctorId").notEmpty().withMessage("معرف الطبيب مطلوب"), // تحقق من وجود doctorId
    body("date").isISO8601().withMessage("تاريخ الجلسة غير صالح"), // تحقق من أن التاريخ بصيغة صحيحة
    body("duration").isInt({ min: 1 }).withMessage("مدة الجلسة يجب أن تكون رقمًا صحيحًا أكبر من 0") // تحقق من أن مدة الجلسة هي عدد صحيح أكبر من 0
  ],
  async (req, res, next) => {
    // التحقق من الأخطاء في المدخلات
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // تمرير الطلب إلى createSession بعد التحقق من المدخلات
      await createSession(req, res, next);
    } catch (error) {
      next(error); // تمرير الخطأ إلى معالج الأخطاء
    }
  }
);

export default router;
