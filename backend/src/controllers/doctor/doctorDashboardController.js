import Test from "../../models/Test.js";
import Patient from "../../models/Patient.js";

export const getDoctorDashboard = async (req, res) => {
  try {
    const doctorId = req.doctor._id;
    const centerId = req.doctor.center; // ✅ مركز الطبيب

    /* =========================
       عدد المرضى (من المركز)
    ========================= */
    const patientsCount = await Patient.countDocuments({
      center: centerId,
    });

    /* =========================
       الفحوصات المعتمدة للطبيب
    ========================= */
    const approvedTests = await Test.find({
      doctor: doctorId,
      status: "approved",
    })
      .populate("patient", "name file_number")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      patientsCount,                 // ✅ الآن صحيح
      completedTests: approvedTests.length,
      latestTests: approvedTests.map((t) => ({
        _id: t._id,
        patientName: t.patient?.name || "—",
        fileNumber: t.patient?.file_number || "—",
        date: t.createdAt,
        status: t.status,
      })),
    });
  } catch (error) {
    console.error("Doctor dashboard error:", error);
    res.status(500).json({
      message: "تعذر تحميل بيانات لوحة التحكم",
    });
  }
};
