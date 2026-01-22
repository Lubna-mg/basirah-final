import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
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
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

/**
 * منع حجز نفس الطبيب في نفس الوقت
 */
appointmentSchema.index(
  { doctor: 1, date: 1 },
  { unique: true }
);

export default mongoose.model("Appointment", appointmentSchema);
