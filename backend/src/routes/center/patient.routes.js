import { Router } from "express";
import authCenter from "../../middleware/authCenter.js";
import {
  getCenterPatients,
  createPatient,
} from "../../controllers/center/patient.controller.js";

const router = Router();

router.get("/", authCenter, getCenterPatients);
router.post("/", authCenter, createPatient);

export default router;
