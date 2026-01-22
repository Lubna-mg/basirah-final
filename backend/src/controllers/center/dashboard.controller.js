import Doctor from "../../models/Doctor.js";
import Patient from "../../models/Patient.js";
import Session from "../../models/Session.js";
import Activity from "../../models/Activity.js";
import Center from "../../models/Center.js";

export const getCenterDashboard = async (req, res) => {
  try {
    const centerId = req.centerId;

    /* ======================
       الإحصائيات
    ====================== */
    const doctorsCount = await Doctor.countDocuments({ center: centerId });

    const activePatientsCount = await Patient.countDocuments({
      center: centerId,
      status: "active",
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySessionsCount = await Session.countDocuments({
      center: centerId,
      date: { $gte: today },
    });

    const completedTodayCount = await Session.countDocuments({
      center: centerId,
      date: { $gte: today },
      status: "completed",
    });

    /* ======================
       النشاط الأخير
    ====================== */
    const recentActivity = await Activity.find({ center: centerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("text createdAt");

    /* ======================
       بيانات الاشتراك (SOURCE OF TRUTH)
    ====================== */
    const center = await Center.findById(centerId).select(
      "subscriptionPlan subscriptionEndDate"
    );

    if (!center) {
      return res.status(404).json({ message: "المركز غير موجود" });
    }

    const PLAN_MAP = {
      "تجريبي": "trial",
      "تجريبية": "trial",
      "شهري": "monthly",
      "شهريه": "monthly",
      "شهرية": "monthly",
      "سنوي": "yearly",
      "سنوية": "yearly",
      trial: "trial",
      monthly: "monthly",
      yearly: "yearly",
    };

    const plan =
      PLAN_MAP[center.subscriptionPlan] || "trial";

    const isExpired =
      center.subscriptionEndDate &&
      new Date(center.subscriptionEndDate) < new Date();

    const subscription = {
      plan,                 // trial | monthly | yearly
      status: isExpired ? "expired" : "active",
      endDate: center.subscriptionEndDate || null,
    };

    /* ======================
       الاستجابة
    ====================== */
    res.json({
      stats: {
        doctors: doctorsCount,
        activePatients: activePatientsCount,
        todaySessions: todaySessionsCount,
        completedToday: completedTodayCount,
      },
      recentActivity: recentActivity.map((a) => ({
        text: a.text,
        time: a.createdAt,
      })),
      subscription,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      message: "فشل في تحميل بيانات لوحة تحكم المركز",
    });
  }
};
