import express from "express";
import {
  getDoctorNotesByPatient,
  addNoteToPatient,
} from "../../controllers/doctor/doctorNotesController.js";

import { requireDoctor } from "../../middleware/requireDoctor.js";

const router = express.Router();

/* ======================
   ملاحظات المريض
====================== */

// GET notes by patient
router.get("/patient/:patientId", requireDoctor, getDoctorNotesByPatient);

// POST new note to patient
router.post("/patient/:patientId", requireDoctor, addNoteToPatient);

export default router;
