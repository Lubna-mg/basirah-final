import Report from "../../models/Report.js";

/**
 * GET /api/v1/center/reports
 * جلب تقارير المركز
 */
export const getCenterReports = async (req, res) => {
  try {
    const centerId = req.centerId;

    // جلب التقارير المرتبطة بالمركز وترتيبها حسب التاريخ
    const reports = await Report.find({ center: centerId })
      .sort({ createdAt: -1 })
      .lean();  // تحسين الأداء باستخدام lean()

    if (!reports || reports.length === 0) {
      return res.status(404).json({ message: "لا توجد تقارير لهذا المركز." });
    }

    // إرسال الاستجابة مع البيانات
    res.json({
      count: reports.length,
      reports: reports.map((r) => ({
        id: r._id,
        reportNumber: r.reportNumber,
        childName: r.childName,
        doctorName: r.doctorName,
        type: r.type,
        status: r.status,
        date: r.date,
      })),
    });
  } catch (error) {
    console.error("getCenterReports error:", error);
    res.status(500).json({ message: "فشل جلب التقارير، يرجى المحاولة لاحقًا." });
  }
};
