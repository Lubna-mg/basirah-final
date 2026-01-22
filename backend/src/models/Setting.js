import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
      required: true,
      default: "global",
    },
    platformName: {
      type: String,
      default: "منصة بصيرة",
    },
    supportEmail: {
      type: String,
      default: "support@basira.com",
    },
    supportPhone: {
      type: String,
      default: "",
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;
