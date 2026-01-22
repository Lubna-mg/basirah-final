import express from "express";
import doctorAuth from "../../middleware/doctorAuth.js";
import {
  getDoctorSettings,
  updateDoctorProfile,
  changeDoctorPassword,
} from "../../controllers/doctor/doctorSettingsController.js";

const router = express.Router();

/* ======================
   Settings
====================== */
router.get("/", doctorAuth, getDoctorSettings);
router.put("/profile", doctorAuth, updateDoctorProfile);
router.put("/password", doctorAuth, changeDoctorPassword);

export default router;
