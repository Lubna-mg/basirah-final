import express from "express";

// Routes
import authRoutes from "./doctorAuthRoutes.js";
import doctorNotesRoutes from "./doctorNotesRoutes.js";
import doctorPatientRoutes from "./doctorPatientRoutes.js";
import doctorReportRoutes from "./doctorReportRoutes.js";
import doctorSettingsRoutes from "./doctorSettingsRoutes.js";
import doctorTestRoutes from "./doctorTestRoutes.js";
import doctorScanRoutes from "./doctorScanRoutes.js";
import doctorAppointmentRoutes from "./doctorAppointmentRoutes.js";



// Controllers
import { getDoctorDashboard } from "../../controllers/doctor/doctorDashboardController.js";

// Middleware
import doctorAuth from "../../middleware/doctorAuth.js";

const router = express.Router();

/* ======================
   Auth
====================== */
router.use("/auth", authRoutes);

/* ======================
   Dashboard
====================== */
router.get("/dashboard", doctorAuth, getDoctorDashboard);

/* ======================
   Patients
====================== */
router.use("/patients", doctorAuth, doctorPatientRoutes);

/* ======================
   Tests ✅ (المسار الصحيح)
====================== */
router.use("/tests", doctorAuth, doctorTestRoutes);

/* ======================
   Scan
====================== */
router.use("/scan", doctorAuth, doctorScanRoutes);

/* ======================
   Notes
====================== */
router.use("/notes", doctorAuth, doctorNotesRoutes);

/* ======================
   Reports
====================== */
router.use("/reports", doctorAuth, doctorReportRoutes);

/* ======================
   Settings
====================== */
router.use("/settings", doctorAuth, doctorSettingsRoutes);
router.use("/appointments", doctorAuth, doctorAppointmentRoutes);


export default router;
