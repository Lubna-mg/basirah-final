import { Router } from "express";
import authCenter from "../../middleware/authCenter.js";
import Report from "../../models/Report.js";

const router = Router();

/**
 * GET /api/v1/center/reports
 * جلب تقارير المركز
 */
router.get("/", authCenter, async (req, res) => {
  try {
    const reports = await Report.find({
      center: req.centerId,
    }).sort({ createdAt: -1 });

    // ✅ حتى لو فاضي، نرجع 200
    res.json({
      reports: reports.map((report) => ({
        id: report._id,
        reportNumber: report.reportNumber,
        childName: report.childName,
        doctorName: report.doctorName,
        type: report.type,
        status: report.status,
        date: report.date,
      })),
    });
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ message: "فشل جلب التقارير" });
  }
});

export default router;
