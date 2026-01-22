
// src/routes/Admin/adminRoutes.js
import express from "express";
import requireAdmin from "../../middleware/requireAdmin.js";
import { getAdminAnalytics } from "../../controllers/Admin/adminAnalyticsController.js";

// 📌 Controllers
import {
  getCenters,
  createCenter,
  updateCenter,
  deleteCenter,
} from "../../controllers/admin/centers.controller.js";

import {
  listDoctors,
  createDoctor,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "../../controllers/admin/doctors.controller.js";

import { getAdminDashboard } from "../../controllers/admin/dashboard.controller.js";
import { getAdminActivity } from "../../controllers/admin/activity.controller.js";
import { updateAdminSettings } from "../../controllers/admin/settings.controller.js";

// ✅ مسار تحديث الإعدادات
router.put("/settings", updateAdminSettings);

import {
  getAdminSettings,
  updateAdminSettings,
} from "../../controllers/admin/settings.controller.js";

import {
  getSubscriptionsSummary,
  getSubscriptionsList,
} from "../../controllers/admin/subscriptions.controller.js";

import {
  getBillingSummary,
  getInvoicesList,
} from "../../controllers/Admin/billingController.js";

const router = express.Router();

// ✅ كل مسارات هذا الراوتر تتطلب أن يكون المستخدم أدمن
router.use(requireAdmin);

/* ===========================
   📊 Dashboard
   =========================== */

// GET /api/admin/dashboard
router.get("/dashboard", getAdminDashboard);
router.get("/analytics", getAdminAnalytics);
/* ===========================
   🏥 المراكز (Centers)
   =========================== */

// GET /api/admin/centers
router.get("/centers", getCenters);

// POST /api/admin/centers
router.post("/centers", createCenter);

// PUT /api/admin/centers/:id
router.put("/centers/:id", updateCenter);

// DELETE /api/admin/centers/:id
router.delete("/centers/:id", deleteCenter);

/* ===========================
   👨‍⚕️ الأطباء (Doctors)
   =========================== */

// GET /api/admin/doctors
router.get("/doctors", listDoctors);

// POST /api/admin/doctors
router.post("/doctors", createDoctor);

// GET /api/admin/doctors/:id
router.get("/doctors/:id", getDoctorById);

// PUT /api/admin/doctors/:id
router.put("/doctors/:id", updateDoctor);

// DELETE /api/admin/doctors/:id
router.delete("/doctors/:id", deleteDoctor);

/* ===========================
   💳 الاشتراكات (Subscriptions)
   =========================== */

// GET /api/admin/subscriptions/summary
router.get("/subscriptions/summary", getSubscriptionsSummary);

// GET /api/admin/subscriptions
router.get("/subscriptions", getSubscriptionsList);

/* ===========================
   💰 الفوترة (Billing)
   =========================== */

// GET /api/admin/billing/summary
router.get("/billing/summary", getBillingSummary);

// GET /api/admin/billing/invoices
router.get("/billing/invoices", getInvoicesList);

/* ===========================
   📜 سجل نشاط الأدمن
   =========================== */

// GET /api/admin/activity
router.get("/activity", getAdminActivity);

/* ===========================
   ⚙️ إعدادات النظام
   =========================== */

// GET /api/admin/settings
router.get("/settings", getAdminSettings);

// PUT /api/admin/settings
router.put("/settings", updateAdminSettings);

export default router;

