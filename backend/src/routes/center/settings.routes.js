import express from "express";
import {
  getSettings,
  updateSettings,
} from "../../controllers/center/settings.controller.js";
import authCenter from "../../middleware/authCenter.js";

const router = express.Router();

router.get("/", authCenter, getSettings);
router.put("/", authCenter, updateSettings);

export default router;
