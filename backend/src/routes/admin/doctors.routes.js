
import { Router } from "express";
import requireAdmin from "../../middleware/requireAdmin.js";
import {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "../../controllers/admin/doctors.controller.js";

const router = Router();

router.use(requireAdmin);

router.get("/", getDoctors);
router.post("/", createDoctor);
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

export default router;
