import Center from "../../models/Center.js";
import Doctor from "../../models/Doctor.js";
import Patient from "../../models/Patient.js";
import Test from "../../models/Test.js";
import PDFDocument from "pdfkit";

export const downloadAdminReportPdf = async (req, res) => {
  try {
    // ===== إحصائيات المنصة =====
    const centersCount = await Center.countDocuments();
    const doctorsCount = await Doctor.countDocuments();
    const patientsCount = await Patient.countDocuments();
    const testsCount = await Test.countDocuments();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "inline; filename=admin-platform-report.pdf"
    );

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(res);

    /* ================= Header ================= */
    doc
      .fillColor("#0A2A43")
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("بصيرة", { align: "right" });

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#475569")
      .text("Basira Medical Platform", { align: "right" });

    doc.moveDown(2);

    /* ================= Title ================= */
    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .fillColor("#0A2A43")
      .text("التقرير الإداري - ملخص المنصة", {
        align: "center",
      });

    doc.moveDown(2);

    /* ================= Info ================= */
    doc
      .fontSize(12)
      .font("Helvetica")
      .fillColor("#475569")
      .text(`تاريخ التقرير: ${new Date().toLocaleDateString("ar-SA")}`)
      .moveDown(0.5);

    doc.moveDown(1.5);

    /* ================= Summary ================= */
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .fillColor("#0A2A43")
      .text("ملخص إداري");

    doc.moveDown(0.5);

    doc
      .fontSize(11)
      .font("Helvetica")
      .fillColor("#475569")
      .text(
        "يعرض هذا التقرير نظرة عامة على حالة منصة بصيرة، ويهدف إلى دعم اتخاذ القرار الإداري ومتابعة أداء المنصة من حيث عدد المستخدمين والمراكز والفحوصات."
      );

    doc.moveDown(1.5);

    /* ================= Statistics ================= */
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .fillColor("#0A2A43")
      .text("إحصائيات المنصة");

    doc.moveDown(0.8);

    doc.fontSize(12).font("Helvetica").fillColor("#475569");
    doc.text(`عدد المراكز المسجلة: ${centersCount}`);
    doc.text(`عدد الأطباء: ${doctorsCount}`);
    doc.text(`عدد المرضى: ${patientsCount}`);
    doc.text(`عدد الفحوصات المنفذة: ${testsCount}`);

    doc.moveDown(2);

    /* ================= Footer ================= */
    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .strokeColor("#e5e7eb")
      .stroke();

    doc.moveDown(1);

    doc
      .fontSize(9)
      .fillColor("#64748b")
      .text(
        "تنويه: هذا التقرير إداري داعم لاتخاذ القرار ولا يغني عن التحليل التشغيلي التفصيلي للمنصة.",
        { align: "center" }
      );

    doc.end();
  } catch (error) {
    console.error("downloadAdminReportPdf error:", error);
    res.status(500).json({
      message: "فشل إنشاء التقرير الإداري",
    });
  }
};
