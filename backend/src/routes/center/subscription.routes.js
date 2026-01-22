import express from "express";
import authCenter from "../../middleware/authCenter.js";
import {
  getMySubscription,
  requestSubscriptionUpgrade,
} from "../../controllers/center/subscription.controller.js";

const router = express.Router();

/**
 * GET /api/v1/center/subscription
 * جلب الاشتراك الحالي
 */
router.get("/", authCenter, getMySubscription);

/**
 * POST /api/v1/center/subscription/request
 * طلب ترقية (دفع يدوي)
 */
router.post("/request", authCenter, requestSubscriptionUpgrade);

export default router;
