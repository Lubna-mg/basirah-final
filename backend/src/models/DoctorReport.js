import mongoose from "mongoose";

const doctorReportSchema = new mongoose.Schema(
  {
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
      unique: true, // تقرير واحد لكل فحص
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    notes: {
      type: String,
      default: "",
    },

    aiSummary: {
      type: String,
      default: "",
    },

    aiResults: {
      gazeAccuracy: Number,
      attentionScore: Number,
      stimulusResponse: Number,
      fixationStability: Number,
    },

    status: {
      type: String,
      enum: ["draft", "final"],
      default: "draft",
    },
  },
  { timestamps: true }
);

export default mongoose.model("DoctorReport", doctorReportSchema);
