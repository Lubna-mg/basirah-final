
import { Router } from "express";
import requireAdmin from "../../middleware/requireAdmin.js";
import { getInvoices } from "../../controllers/billing/billing.controller.js";

const router = Router();

router.use(requireAdmin);

router.get("/invoices", getInvoices);

export default router;
