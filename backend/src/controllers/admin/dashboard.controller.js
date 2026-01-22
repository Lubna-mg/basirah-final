// src/controllers/admin/dashboard.controller.js
import Center from "../../models/Center.js";
import Doctor from "../../models/Doctor.js";
import AdminUser from "../../models/Admin.js";
import Activity from "../../models/Activity.js";

export async function getAdminDashboard(req, res) {
  try {
    const [activeCenters, doctors, adminUsers] = await Promise.all([
      Center.countDocuments({ status: "active" }),
      Doctor.countDocuments({}),
      AdminUser.countDocuments({}),
    ]);

    // placeholder منطقي لليوم (إذا ما عندك Tests model)
    const todayTests = 0;

    const recentCenters = await Center.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name status subscriptionPlan createdAt");

    const activity = await Activity.find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .select("text createdAt");

    return res.json({
      stats: { activeCenters, doctors, todayTests, adminUsers },
      recentCenters: recentCenters.map((c) => ({
        _id: c._id,
        name: c.name,
        status: c.status,
        planName: c.subscriptionPlan || "تجريبي",
      })),
      activity: activity.map((a) => ({
        _id: a._id,
        text: a.text,
        timeLabel: new Date(a.createdAt).toLocaleString("ar-SA"),
      })),
    });
  } catch (err) {
    console.error("getAdminDashboard error:", err);
    return res.status(500).json({ message: "Failed to load dashboard" });
  }
}
