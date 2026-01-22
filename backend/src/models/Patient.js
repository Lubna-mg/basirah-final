import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
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

    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      min: 1,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },

    file_number: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

patientSchema.index(
  { center: 1, file_number: 1 },
  { unique: true }
);

export default mongoose.model("Patient", patientSchema);
