import express from "express";

import authRoutes from "./auth.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import centersRoutes from "./centers.routes.js";
import doctorsRoutes from "./doctors.routes.js";
import subscriptionsRoutes from "./subscriptions.routes.js";
import billingRoutes from "./billing.routes.js";
import reportsRoutes from "./reports.routes.js";
import settingsRoutes from "./settings.routes.js";
import activityRoutes from "./activity.routes.js";
import analyticsRoutes from "./analytics.routes.js"; // ✅ مهم
import notificationsRoutes from "./notifications.routes.js";


const router = express.Router();
router.use("/notifications", notificationsRoutes);
router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/centers", centersRoutes);
router.use("/doctors", doctorsRoutes);
router.use("/subscriptions", subscriptionsRoutes);
router.use("/billing", billingRoutes);
router.use("/reports", reportsRoutes);
router.use("/settings", settingsRoutes);
router.use("/activity", activityRoutes);
router.use("/analytics", analyticsRoutes); // ✅ هنا الحل

export default router;
