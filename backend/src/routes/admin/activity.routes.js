
import { Router } from "express";
import requireAdmin from "../../middleware/requireAdmin.js";
import { getActivity } from "../../controllers/admin/activity.controller.js";

const router = Router();

router.use(requireAdmin);

router.get("/", getActivity);

export default router;
