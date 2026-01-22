import express from "express";
import requireAdmin from "../../middleware/requireAdmin.js";
import { downloadReportPdf } from "../../controllers/admin/reports.controller.js";

const router = express.Router();

// PDF Report
router.get(
  "/centers-summary/pdf",
  requireAdmin,
  downloadReportPdf
);

export default router;
