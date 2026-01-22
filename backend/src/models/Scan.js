import mongoose from "mongoose";

const scanSchema = new mongoose.Schema(
  {
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

    duration: {
      type: Number,
      default: 0,
    },

    stoppedEarly: {
      type: Boolean,
      default: false,
    },

    aiResult: {
      images: Number,
      asd_images: Number,
      asd_ratio: Number,
      final_result: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Scan", scanSchema);
