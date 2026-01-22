
// src/routes/admin/centers.routes.js
import { Router } from "express";
import requireAdmin from "../../middleware/requireAdmin.js";
import {
  listCenters,
  createCenter,
  updateCenter,
  deleteCenter,
} from "../../controllers/admin/centers.controller.js";

const router = Router();

router.use(requireAdmin);

router.get("/", listCenters);
router.post("/", createCenter);
router.put("/:id", updateCenter);
router.delete("/:id", deleteCenter);

export default router;
