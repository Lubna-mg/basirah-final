import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const doctorSchema = new mongoose.Schema(
  {
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
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    specialty: {
      type: String,
      trim: true,
    },

    center: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Center",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    /* ======================
       Settings (NEW)
    ====================== */
    settings: {
      notifications: {
        newNote: {
          type: Boolean,
          default: true,
        },
        newTest: {
          type: Boolean,
          default: true,
        },
        reminders: {
          type: Boolean,
          default: true,
        },
      },

      language: {
        type: String,
        enum: ["ar", "en"],
        default: "ar",
      },
    },
  },
  { timestamps: true }
);

/* ======================
   Hash password before save
====================== */
doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
