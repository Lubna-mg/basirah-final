import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    center: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Center",
      required: true,
      index: true,
    },

    /* نوع الباقة (داخليًا) */
    plan: {
      type: String,
      enum: ["trial", "monthly", "yearly"],
      default: "trial",
    },

    /* اسم الباقة للعرض */
    displayPlan: {
      type: String,
      default: "تجريبي",
    },

    /* حالة الاشتراك */
    status: {
      type: String,
      enum: ["active", "pending", "suspended", "expired"],
      default: "active",
      index: true,
    },

    price: {
      type: Number,
      default: 0,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
    },

    limits: {
      maxDoctors: {
        type: Number,
        default: null,
      },
      maxSessionsPerMonth: {
        type: Number,
        default: null,
      },
    },

    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
