import express from "express";
import requireAdmin from "../../middleware/requireAdmin.js";
import { downloadReportPdf } from "../../controllers/admin/reports.controller.js";

const router = express.Router();

// PDF Report
// تعديل المسار ليشمل centerId
router.get(
  "/:centerId/center-summary/pdf",  // تم إضافة :centerId هنا
  requireAdmin,
  downloadReportPdf
);

export default router;
