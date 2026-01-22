import express from "express";
import doctorAuth from "../../middleware/doctorAuth.js";
import { getMyAppointments } from "../../controllers/doctor/doctorAppointmentController.js";

const router = express.Router();

router.get("/", doctorAuth, getMyAppointments);

export default router;
