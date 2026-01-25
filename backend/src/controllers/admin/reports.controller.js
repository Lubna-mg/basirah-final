import Center from "../../models/Center.js";
import Doctor from "../../models/Doctor.js";
import Patient from "../../models/Patient.js";
import Test from "../../models/Test.js";
import PDFDocument from "pdfkit";

export const downloadReportPdf = async (req, res) => {
  try {
    const { centerId } = req.params;  // معرف المركز

    // جلب بيانات المركز
    const center = await Center.findById(centerId);
    if (!center) {
      return res.status(404).json({ message: "المركز غير موجود" });
    }

    // الإحصائيات الخاصة بالمركز
    const doctorsCount = await Doctor.countDocuments({ center: centerId });
    const patientsCount = await Patient.countDocuments({ center: centerId });
    const testsCount = await Test.countDocuments({ center: centerId });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=center-report-${center._id}.pdf`
    );

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(res);

    /* ================= Header ================= */
    doc
      .fillColor("#0A2A43")
      .fontSize(22)
      .font("Helvetica-Bold")
      .text("Basira Medical Platform", { align: "left" });

    doc
      .moveDown(0.3)
      .fontSize(14)
      .font("Helvetica")
      .fillColor("#475569")
      .text(`تقرير مركز: ${center.name}`);

    doc
      .moveDown(0.2)
      .fontSize(10)
      .text(`تاريخ التقرير: ${new Date().toLocaleString("ar-SA")}`);

    doc.moveDown(1.5);

    /* ================= Center Info ================= */
    doc
      .fontSize(12)
      .fillColor("#475569")
      .text(`المدينة: ${center.city || "-"}`);
    doc.text(`البريد الإلكتروني: ${center.email}`);
    doc.text(`رقم الهاتف: ${center.phone}`);
    doc.text(`حالة الاشتراك: ${center.subscriptionPlan}`);
    doc.text(
      `تاريخ الاشتراك: ${
        center.subscriptionEndDate
          ? new Date(center.subscriptionEndDate).toLocaleDateString("ar-SA")
          : "غير محدد"
      }`
    );

    doc.moveDown(1.5);

    /* ================= Stats ================= */
    doc
      .fontSize(13)
      .font("Helvetica-Bold")
      .fillColor("#0A2A43")
      .text("الإحصائيات");

    doc.moveDown(0.5);

    doc
      .fontSize(12)
      .font("Helvetica")
      .fillColor("#475569")
      .text(`عدد الأطباء: ${doctorsCount}`);
    doc.text(`عدد المرضى: ${patientsCount}`);
    doc.text(`عدد الفحوصات: ${testsCount}`);

    doc.moveDown(1.5);

    /* ================= Footer ================= */
    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .strokeColor("#e5e7eb")
      .stroke();

    doc.moveDown(0.8);

    doc
      .fontSize(9)
      .fillColor("#64748b")
      .text(
        "تم إنشاء التقرير بتاريخ: " + new Date().toLocaleString("ar-SA"),
        { align: "center" }
      );

    doc.end();
  } catch (error) {
    console.error("downloadReportPdf error:", error);
    res.status(500).json({
      message: "فشل إنشاء التقرير",
    });
  }
};
