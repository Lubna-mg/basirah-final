import { Router } from "express";
import requireAdmin from "../../middleware/requireAdmin.js";
import { createPayment } from "../../controllers/payment.controller.js";

const router = Router();

router.post("/", requireAdmin, createPayment);

export default router;
