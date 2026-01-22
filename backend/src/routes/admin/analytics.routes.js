
import { Router } from "express";
import requireAdmin from "../../middleware/requireAdmin.js";
import { getAdminAnalytics } from "../../controllers/admin/analytics.controller.js";

const router = Router();

router.use(requireAdmin);
router.get("/", getAdminAnalytics);

export default router;
