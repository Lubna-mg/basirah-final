import express from "express";
import requireAdmin from "../../middleware/requireAdmin.js";
import {
  getSettings,
  updateSettings,
} from "../../controllers/admin/settings.controller.js";

const router = express.Router();

// جلب إعدادات النظام (للأدمن فقط)
router.get("/", requireAdmin, getSettings);

// تحديث الإعدادات (للأدمن فقط)
router.put("/", requireAdmin, updateSettings);

export default router;
