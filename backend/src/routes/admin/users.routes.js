
import express from "express";
import requireAdmin from "../../middleware/requireAdmin.js";
import { getAllUsers } from "../../controllers/admin/adminUserController.js";

const router = express.Router();

router.get("/", requireAdmin, getAllUsers);

export default router;
