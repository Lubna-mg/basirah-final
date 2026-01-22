
import Payment from "../../models/Payment.js";

export const getInvoices = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("center", "name")
      .sort({ createdAt: -1 });

    res.json({
      invoices: payments.map((p) => ({
        id: p._id,
        centerName: p.center?.name || "—",
        amount: p.amount,
        status: p.status,
        createdAt: p.createdAt,
      })),
    });
  } catch (error) {
    console.error("getInvoices error:", error);
    res.status(500).json({
      message: "حدث خطأ أثناء جلب الفواتير",
    });
  }
};
