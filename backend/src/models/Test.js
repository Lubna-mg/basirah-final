import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
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

    center: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Center",
      required: true,
    },

    type: {
      type: String,
      enum: ["eye_tracking"],
      required: true,
    },

    status: {
      type: String,
      enum: ["scanned", "draft", "approved"],
      default: "scanned",
    },

    duration: {
      type: Number,
      default: 0,
    },

    stoppedEarly: {
      type: Boolean,
      default: false,
    },

    /* ======================
       ملاحظات الطبيب
    ====================== */
    notes: [
      {
        text: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["note", "recommendation"],
          default: "note",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    /* ======================
       🔥 نتيجة الذكاء الاصطناعي (التعديل المهم)
    ====================== */
    aiResult: {
  label: {
    type: String,
    enum: ["ASD", "Normal", "Inconclusive"],
  },
  confidence: {
    type: Number,
  },
  heatmapImage: {
    type: String,
  },
  gazeStats: {
    center: Number,
    left: Number,
    right: Number,
  },
},

  },
  { timestamps: true }
);

export default mongoose.model("Test", testSchema);
