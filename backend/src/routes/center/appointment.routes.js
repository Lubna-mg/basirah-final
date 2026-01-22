import { Router } from "express";
import authCenter from "../../middleware/authCenter.js";
import {
  getCenterAppointments,
  createAppointment,
  updateAppointmentStatus,
} from "../../controllers/center/appointment.controller.js";

const router = Router();

router.get("/", authCenter, getCenterAppointments);
router.post("/", authCenter, createAppointment);
router.put("/:id", authCenter, updateAppointmentStatus);

export default router;
