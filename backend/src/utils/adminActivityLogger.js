// src/utils/adminActivityLogger.js
import AdminActivity from "../models/Activity.js";

export const logAdminActivity = async ({ adminId, action, meta }) => {
  try {
    if (!adminId || !action) {
      return;
    }

    await AdminActivity.create({
      admin: adminId,
      action,
      meta: meta || {},
    });
  } catch (err) {
    // ما نطيح السيرفر بسبب خطأ في التسجيل
    console.error("logAdminActivity error:", err);
  }
};
