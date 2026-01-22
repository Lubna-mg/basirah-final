import express from "express";
import doctorAuth from "../../middleware/doctorAuth.js";
import {
  getPatients,
  addPatient,
  getPatientById,
} from "../../controllers/doctor/doctorPatientController.js";

const router = express.Router();

// /api/v1/doctor/patients
router.get("/", doctorAuth, getPatients);
router.post("/", doctorAuth, addPatient);
router.get("/:id", doctorAuth, getPatientById);

export default router;
