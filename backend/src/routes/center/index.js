import { Router } from "express";
import authCenter from "../../middleware/authCenter.js";

import patientRoutes from "./patient.routes.js";
import doctorRoutes from "./doctor.routes.js";
import settingsRoutes from "./settings.routes.js";
import reportRoutes from "./report.routes.js";
import appointmentRoutes from "./appointment.routes.js";
import subscriptionRoutes from "./subscription.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

import { getMySubscription } from "../../controllers/center/subscription.controller.js";

const router = Router();

/* ======================
   Dashboard
====================== */
router.use("/dashboard", authCenter, dashboardRoutes);

/* ======================
   Subscription
====================== */
router.get("/subscription", authCenter, getMySubscription);
router.use("/subscription", authCenter, subscriptionRoutes);

/* ======================
   Appointments
====================== */
router.use("/appointments", authCenter, appointmentRoutes);

/* ======================
   Patients & Doctors
====================== */
router.use("/patients", authCenter, patientRoutes);
router.use("/doctors", authCenter, doctorRoutes);

/* ======================
   Settings & Reports
====================== */
router.use("/settings", authCenter, settingsRoutes);
router.use("/reports", authCenter, reportRoutes);

export default router;
