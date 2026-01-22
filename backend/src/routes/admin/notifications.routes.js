import express from "express";
import {
  getNotifications,
  markAllAsRead,
} from "../../controllers/admin/notifications.controller.js";

const router = express.Router();

router.get("/", getNotifications);
router.put("/read", markAllAsRead);

export default router;
