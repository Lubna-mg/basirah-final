import express from "express";
import { requireDoctor } from "../../middleware/requireDoctor.js";

import {
  getMyPatients,
  createPatient,
  getPatientById, // ✅ إضافة
} from "../../controllers/doctor/doctorPatientController.js";

const router = express.Router();

// GET /api/v1/doctor/patients
router.get("/", requireDoctor, getMyPatients);

// GET /api/v1/doctor/patients/:id ✅ جديد
router.get("/:id", requireDoctor, getPatientById);

// POST /api/v1/doctor/patients
router.post("/", requireDoctor, createPatient);

export default router;
