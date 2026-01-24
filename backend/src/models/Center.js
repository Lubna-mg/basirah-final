import mongoose from "mongoose";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;

const centerSchema = new mongoose.Schema(
  {
    /* ===== بيانات أساسية ===== */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [emailRegex, "البريد الإلكتروني غير صالح"],
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      match: [phoneRegex, "رقم الهاتف غير صالح"],
    },

    city: {
      type: String,
      trim: true,
      default: "",
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    /* ===== حالة المركز (للأدمن) ===== */
    status: {
      type: String,
      enum: ["بانتظار التفعيل", "مفعّل", "موقّف"],
      default: "بانتظار التفعيل",
    },

    /* ===== الاشتراك ===== */
    subscriptionPlan: {
      type: String,
      enum: ["تجريبي", "شهرية", "سنوية"],
      default: "تجريبي",
    },

    subscriptionEndDate: {
      type: Date,
      default: null,
    },

    /* ===== أمان ===== */
    password: {
      type: String,
      required: true,          // ⚠️ يبقى required
      select: false,           // لا يُرجع في أي query
    },

    // ✅ flag لإجبار تغيير كلمة المرور أول دخول
    mustChangePassword: {
      type: Boolean,
      default: true,
    },

    /* ===== إعدادات المنصة ===== */
    notifications: {
      reports: { type: Boolean, default: true },
      sessions: { type: Boolean, default: true },
      payments: { type: Boolean, default: true },
      doctors: { type: Boolean, default: true },
    },

    /* ===== ملاحظات داخلية ===== */
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Center", centerSchema);
