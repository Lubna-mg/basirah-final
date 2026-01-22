import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    /* 🔗 ربط الدفع بالمركز */
    center: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Center",
      required: true,
      index: true,
    },

    /* 🔗 ربطه بالاشتراك (أساسي) */
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
      index: true,
    },

    /* 🧾 رقم الفاتورة */
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    /* 💰 المبلغ */
    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "SAR",
    },

    /* 🧠 نوع الفترة */
    period: {
      type: String,
      enum: ["monthly", "yearly", "trial"],
      default: "monthly",
    },

    /* 🔘 حالة الدفع */
    status: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "paid",
    },

    /* 💳 طريقة الدفع */
    method: {
      type: String,
      enum: ["mada", "credit_card", "bank_transfer", "manual"],
      default: "manual",
    },

    /* 📅 تاريخ الدفع */
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
