import express from "express";
import requireAdmin from "../../middleware/requireAdmin.js";
import { downloadAdminReportPdf } from "../../controllers/admin/reports.controller.js";

const router = express.Router();

// ✅ تقرير إداري عام (بدون centerId)
router.get(
  "/admin-summary",
  requireAdmin,
  downloadAdminReportPdf
);

export default router;
