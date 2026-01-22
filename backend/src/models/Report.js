import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    /* 🔗 العلاقات */
    center: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Center",
      required: true,
      index: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },

    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
      unique: true, // تقرير واحد لكل اختبار
    },

    /* 📝 ملاحظات الطبيب */
    notes: {
      type: String,
      default: "",
    },

    /* 🤖 ملخص الذكاء الاصطناعي */
    aiSummary: {
      type: String,
      default: "",
    },

    /* 📊 نتائج الذكاء الاصطناعي */
    aiResults: {
      gazeAccuracy: Number,
      attentionScore: Number,
      stimulusResponse: Number,
      fixationStability: Number,
    },

    /* 📌 حالة التقرير */
    status: {
      type: String,
      enum: ["draft", "final"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Report", reportSchema);
