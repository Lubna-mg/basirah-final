import Payment from "../models/Payment.js";
import Subscription from "../models/Subscription.js";

/**
 * جلب فواتير مركز معيّن
 * GET /api/v1/center/payments
 */
export const getCenterPayments = async (req, res) => {
  try {
    const centerId = req.centerId;

    const payments = await Payment.find({ center: centerId })
      .sort({ createdAt: -1 });

    res.json({
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("getCenterPayments error:", error);
    res.status(500).json({ message: "فشل جلب الفواتير" });
  }
};

/**
 * (للأدمن) إنشاء دفعة / فاتورة جديدة لمركز
 * POST /api/v1/admin/payments
 */
export const createPayment = async (req, res) => {
  try {
    const {
      centerId,
      amount,
      period,
      method,
      status = "paid",
    } = req.body;

    if (!centerId || !amount) {
      return res.status(400).json({
        message: "البيانات غير مكتملة",
      });
    }

    const invoiceNumber = `INV-${Date.now()}`;

    const payment = await Payment.create({
      center: centerId,
      amount,
      period,
      method,
      status,
      invoiceNumber,
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error("createPayment error:", error);
    res.status(500).json({ message: "فشل إنشاء الفاتورة" });
  }
};
