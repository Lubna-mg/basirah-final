import DoctorReport from "../../models/DoctorReport.js";
import Test from "../../models/Test.js";
import Patient from "../../models/Patient.js";

/* =========================
   جلب تقرير فحص واحد
========================= */
export const getReportByTest = async (req, res) => {
  const { testId } = req.params;

  const report = await DoctorReport.findOne({ test: testId })
    .populate("patient", "name age file_number")
    .populate("doctor", "name");

  if (!report) {
    return res.status(404).json({ message: "لا يوجد تقرير بعد" });
  }

  res.json(report);
};

/* =========================
   إنشاء / تحديث تقرير
========================= */
export const saveReport = async (req, res) => {
  const { testId } = req.params;
  const { notes, aiSummary, status } = req.body;

  const test = await Test.findById(testId).populate("patient");

  if (!test) {
    return res.status(404).json({ message: "الفحص غير موجود" });
  }

  const report = await DoctorReport.findOneAndUpdate(
    { test: testId },
    {
      test: testId,
      patient: test.patient._id,
      doctor: req.doctor._id,
      notes,
      aiSummary,
      aiResults: test.aiResults || {},
      status: status || "draft",
    },
    { new: true, upsert: true }
  );

  res.json(report);
};

/* =========================
   قائمة تقارير الطبيب (متطورة)
========================= */
export const getDoctorReports = async (req, res) => {
  try {
    const { fileNumber, status } = req.query;

    const query = { doctor: req.doctor._id };

    // 🔍 فلترة برقم الملف (بدون كسر الصفحة)
    if (fileNumber) {
      const patient = await Patient.findOne({
        file_number: fileNumber,
      });

      if (patient) {
        query.patient = patient._id;
      }
    }

    // 📌 فلترة بالحالة
    if (status && status !== "all") {
      query.status = status;
    }

    const reports = await DoctorReport.find(query)
      .populate("patient", "name file_number")
      .sort({ createdAt: -1 });

    // 📊 إحصائيات
    const total = reports.length;
    const draft = reports.filter(r => r.status === "draft").length;
    const final = reports.filter(r => r.status === "final").length;

    res.json({
      reports,
      stats: {
        total,
        draft,
        final,
      },
    });

  } catch (error) {
    console.error("getDoctorReports error:", error);
    res.status(500).json({ message: "فشل تحميل التقارير" });
  }
};
