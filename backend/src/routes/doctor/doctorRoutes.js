import express from "express";
import { getDoctorProfile } from "../../controllers/doctor/doctorController.js";
import testRoutes from "./doctorTestRoutes.js";
import { runEyeTrackingTest } from "../controllers/aiController.js";
const router = express.Router();
router.post("/eye-test", runEyeTrackingTest);
router.get("/profile", getDoctorProfile);

// ✅ فحوصات الطبيب
router.use("/tests", testRoutes);

export default router;
