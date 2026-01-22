import Test from "../../models/Test.js";
import Doctor from "../../models/Doctor.js";
import Center from "../../models/Center.js";

/* ===============================
   Helper: تحديد الفترات
================================ */
function getRanges(range) {
  const now = new Date();
  const endCurrent = now;

  const days = range === "month" ? 30 : 7;

  const startCurrent = new Date();
  startCurrent.setDate(endCurrent.getDate() - (days - 1));

  const endPrev = new Date(startCurrent);
  endPrev.setDate(startCurrent.getDate() - 1);

  const startPrev = new Date();
  startPrev.setDate(endPrev.getDate() - (days - 1));

  return {
    range,
    current: { start: startCurrent, end: endCurrent },
    previous: { start: startPrev, end: endPrev },
  };
}

/* ===============================
   GET /api/v1/admin/analytics
================================ */
export const getAdminAnalytics = async (req, res) => {
  try {
    const rawRange = req.query.range === "month" ? "month" : "week";
    const { range, current, previous } = getRanges(rawRange);

    /* ========= الفحوصات ========= */
    const currentTests = await Test.find({
      createdAt: { $gte: current.start, $lte: current.end },
      status: "completed",
    });

    const prevTests = await Test.find({
      createdAt: { $gte: previous.start, $lte: previous.end },
      status: "completed",
    });

    const scans = currentTests.length;
    const videoScans = currentTests.filter((t) => t.type === "video").length;
    const eyeTests = currentTests.filter((t) => t.type === "eye").length;

    /* ========= أرقام النظام (مو مرتبطة بالفحوصات) ========= */
    const activeDoctors = await Doctor.countDocuments();
    const activeCenters = await Center.countDocuments({ status: "active" });

    const currentStats = {
      scans,
      videoScans,
      eyeTests,
      activeDoctors,
      activeCenters,
    };

    const previousStats = {
      scans: prevTests.length,
      videoScans: prevTests.filter((t) => t.type === "video").length,
      eyeTests: prevTests.filter((t) => t.type === "eye").length,
      activeDoctors,
      activeCenters,
    };

    /* ========= Trend ========= */
    let trend = [];

    if (range === "week") {
      const labels = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
      const map = new Map(labels.map((l) => [l, 0]));

      currentTests.forEach((t) => {
        const label = labels[t.createdAt.getDay()];
        map.set(label, (map.get(label) || 0) + 1);
      });

      trend = labels.map((label) => ({
        label,
        value: map.get(label) || 0,
      }));
    } else {
      trend = [
        { label: "الأسبوع 1", value: 0 },
        { label: "الأسبوع 2", value: 0 },
        { label: "الأسبوع 3", value: 0 },
        { label: "الأسبوع 4", value: 0 },
      ];

      currentTests.forEach((t) => {
        const diffDays = Math.floor(
          (t.createdAt - current.start) / (1000 * 60 * 60 * 24)
        );
        const index = Math.min(Math.max(Math.floor(diffDays / 7), 0), 3);
        trend[index].value += 1;
      });
    }

    /* ========= Top Centers ========= */
    const centersMap = new Map();

    currentTests.forEach((t) => {
      if (!t.center) return;
      const id = t.center.toString();

      if (!centersMap.has(id)) {
        centersMap.set(id, { scans: 0 });
      }

      centersMap.get(id).scans += 1;
    });

    const topCenters = Array.from(centersMap.entries())
      .map(([id, v]) => ({ centerId: id, scans: v.scans }))
      .sort((a, b) => b.scans - a.scans)
      .slice(0, 3);

    /* ========= Response ========= */
    return res.json({
      range,
      current: currentStats,
      previous: previousStats,
      trend,
      topCenters,
    });
  } catch (err) {
    console.error("Admin Analytics Error:", err);
    return res
      .status(500)
      .json({ message: "حدث خطأ أثناء تحميل بيانات التحليلات" });
  }
};
