import express from "express";
import doctorAuth from "../../middleware/doctorAuth.js";
import {
  getReportByTest,
  saveReport,
  getDoctorReports,
} from "../../controllers/doctor/doctorReportController.js";

const router = express.Router();

/**
 * قائمة تقارير الطبيب (السايد بار)
 * GET /api/v1/doctor/reports
 */
router.get("/", doctorAuth, getDoctorReports);

/**
 * جلب تقرير فحص
 * GET /api/v1/doctor/reports/:testId
 */
router.get("/:testId", doctorAuth, getReportByTest);

/**
 * حفظ / تحديث تقرير
 * POST /api/v1/doctor/reports/:testId
 */
router.post("/:testId", doctorAuth, saveReport);

export default router;
