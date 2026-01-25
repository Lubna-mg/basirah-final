import Center from "../../models/Center.js";
import PDFDocument from "pdfkit";

export const downloadReportPdf = async (req, res) => {
  try {
    const centers = await Center.find().limit(10);

    const totalCenters = await Center.countDocuments();
    const activeCenters = await Center.countDocuments({ status: "active" });
    const pendingCenters = await Center.countDocuments({ status: "pending" });
    const suspendedCenters = await Center.countDocuments({ status: "suspended" });

    const activeRate =
      totalCenters > 0
        ? ((activeCenters / totalCenters) * 100).toFixed(1)
        : 0;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=basira-admin-centers-report.pdf"
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
      .text("Administrative Centers Report");

    doc
      .moveDown(0.2)
      .fontSize(10)
      .text(`Generated at: ${new Date().toLocaleString("en-GB")}`);

    doc.moveDown(1.5);

    /* ================= Executive Summary ================= */
    doc
      .fontSize(13)
      .font("Helvetica-Bold")
      .fillColor("#0A2A43")
      .text("Executive Summary");

    doc
      .moveDown(0.5)
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#334155")
      .text(
        "This report provides an administrative overview of registered medical centers on the Basira platform. "
        + "It is intended for operational monitoring, quality assurance, and subscription management purposes."
      );

    doc.moveDown(1.5);

    /* ================= KPI Boxes ================= */
    const boxY = doc.y;
    const boxWidth = 200;
    const boxHeight = 55;

    const drawBox = (x, y, title, value) => {
      doc
        .roundedRect(x, y, boxWidth, boxHeight, 8)
        .fillAndStroke("#f8fafc", "#e5e7eb");

      doc
        .fillColor("#64748b")
        .fontSize(9)
        .text(title, x + 15, y + 12);

      doc
        .fillColor("#0A2A43")
        .fontSize(18)
        .font("Helvetica-Bold")
        .text(value, x + 15, y + 28);
    };

    drawBox(50, boxY, "Total Centers", totalCenters);
    drawBox(300, boxY, "Active Centers", activeCenters);
    drawBox(50, boxY + 70, "Pending Centers", pendingCenters);
    drawBox(300, boxY + 70, "Suspended Centers", suspendedCenters);

    doc.moveDown(6);

    /* ================= Centers Table ================= */
    doc
      .fontSize(13)
      .font("Helvetica-Bold")
      .fillColor("#0A2A43")
      .text("Registered Centers Overview");

    doc.moveDown(0.8);

    centers.forEach((c, i) => {
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor("#0A2A43")
        .text(`${i + 1}. ${c.name}`);

      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#475569")
        .text(
          `City: ${c.city || "-"} | Status: ${c.status} | Plan: ${c.subscriptionPlan || "—"}`
        );

      doc.moveDown(0.6);
    });

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
        "This report is intended for administrative and operational use only. "
        + "It does not contain medical or diagnostic data.",
        { align: "center" }
      );

    doc.end();
  } catch (error) {
    console.error("downloadReportPdf error:", error);
    res.status(500).json({
      message: "Failed to generate administrative report",
    });
  }
};
