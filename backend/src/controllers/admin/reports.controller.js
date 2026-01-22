import Center from "../../models/Center.js";
import PDFDocument from "pdfkit";

export const downloadReportPdf = async (req, res) => {
  try {
    const centers = await Center.find();

    const totalCenters = centers.length;
    const activeCenters = centers.filter(c => c.status === "active").length;
    const pendingCenters = centers.filter(c => c.status === "pending").length;
    const suspendedCenters = centers.filter(c => c.status === "suspended").length;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=centers-summary-report.pdf"
    );

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(res);

    /* ========= Header ========= */
    doc
      .fillColor("#1e3a8a")
      .fontSize(22)
      .text("Basira Platform", { align: "left" });

    doc
      .fontSize(14)
      .fillColor("#475569")
      .text("Centers Summary Report");

    doc.moveDown(2);

    /* ========= Divider ========= */
    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .strokeColor("#e5e7eb")
      .stroke();

    doc.moveDown(2);

    /* ========= Stats Boxes ========= */
    const boxY = doc.y;
    const boxWidth = 220;
    const boxHeight = 60;

    const drawBox = (x, y, title, value, color) => {
      doc
        .roundedRect(x, y, boxWidth, boxHeight, 8)
        .fillAndStroke("#f8fafc", "#e5e7eb");

      doc
        .fillColor("#475569")
        .fontSize(10)
        .text(title, x + 15, y + 12);

      doc
        .fillColor(color)
        .fontSize(22)
        .font("Helvetica-Bold")
        .text(value, x + 15, y + 30);
    };

    drawBox(50, boxY, "Total Centers", totalCenters, "#1e40af");
    drawBox(300, boxY, "Active Centers", activeCenters, "#16a34a");

    drawBox(50, boxY + 80, "Pending Centers", pendingCenters, "#ca8a04");
    drawBox(300, boxY + 80, "Suspended Centers", suspendedCenters, "#dc2626");

    doc.moveDown(6);

    /* ========= Footer ========= */
    doc
      .fontSize(10)
      .fillColor("#64748b")
      .text(
        `Generated at: ${new Date().toLocaleString()}`,
        { align: "center" }
      );

    doc.end();
  } catch (error) {
    console.error("downloadReportPdf error:", error);
    res.status(500).json({
      message: "Failed to generate report",
    });
  }
};
