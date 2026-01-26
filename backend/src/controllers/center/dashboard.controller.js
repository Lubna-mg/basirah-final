import Center from "../../models/Center.js";
import Doctor from "../../models/Doctor.js";
import Patient from "../../models/Patient.js";

export const getCenterDashboard = async (req, res) => {
  try {
    const centerId = req.centerId;

    // 🛑 لو ما وصل centerId
    if (!centerId) {
      return res.json({
        stats: {
          doctors: 0,
          activePatients: 0,
          todaySessions: 0,
          completedToday: 0,
        },
        recentActivity: [],
        subscription: {
          plan: "trial",
          status: "active",
          endDate: null,
        },
      });
    }

    const doctors = await Doctor.find({ center: centerId }).lean().catch(() => []);
    const patients = await Patient.find({ center: centerId }).lean().catch(() => []);

    res.json({
      stats: {
        doctors: doctors.length,
        activePatients: patients.length,
        todaySessions: 0,
        completedToday: 0,
      },
      recentActivity: [],
      subscription: {
        plan: "trial",
        status: "active",
        endDate: null,
      },
    });
  } catch (err) {
    console.error("Dashboard error:", err);

    // ✅ حتى لو صار خطأ، نرجع شي
    res.json({
      stats: {
        doctors: 0,
        activePatients: 0,
        todaySessions: 0,
        completedToday: 0,
      },
      recentActivity: [],
      subscription: {
        plan: "trial",
        status: "active",
        endDate: null,
      },
    });
  }
};
