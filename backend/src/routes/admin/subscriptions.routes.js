import { Router } from "express";
import requireAdmin from "../../middleware/requireAdmin.js";

import {
  getSubscriptionsSummary,
  getSubscriptionsList,
  activateSubscription,
  resetSubscriptionToTrial,
} from "../../controllers/admin/subscriptions.controller.js";

const router = Router();

// استخدام :centerId بدلاً من :id
router.get("/summary", requireAdmin, getSubscriptionsSummary);
router.get("/", requireAdmin, getSubscriptionsList);

// التفعيل مع :centerId
router.put("/:centerId/activate", requireAdmin, activateSubscription);

// إعادة الاشتراك التجريبي مع :centerId
router.put("/:centerId/reset-trial", requireAdmin, resetSubscriptionToTrial);

export default router;
