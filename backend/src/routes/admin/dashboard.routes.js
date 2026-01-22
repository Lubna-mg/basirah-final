
// src/routes/admin/dashboard.routes.js
import { Router } from "express";
import requireAdmin from "../../middleware/requireAdmin.js";
import { getAdminDashboard } from "../../controllers/admin/dashboard.controller.js";

const router = Router();
router.get("/", requireAdmin, getAdminDashboard);

export default router;

