// src/models/AdminActivity.js
import mongoose from "mongoose";

const adminActivitySchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    meta: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const AdminActivity = mongoose.model("AdminActivity", adminActivitySchema);

export default AdminActivity;
