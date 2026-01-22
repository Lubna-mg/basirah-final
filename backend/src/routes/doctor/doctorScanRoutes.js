import express from "express";
import multer from "multer";

import {
  startScan,
  uploadScanFrame,
  finishScan,
} from "../../controllers/doctor/doctorScanController.js";

const router = express.Router();

// حفظ الصور مؤقتًا
const upload = multer({
  storage: multer.memoryStorage(),
});

// ==============================
// بدء جلسة فحص
// POST /api/v1/doctor/scan/start
// ==============================
router.post("/start", startScan);

// ==============================
// استقبال صورة من الكاميرا
// POST /api/v1/doctor/scan/:scanId/frame
// ==============================
router.post("/:scanId/frame", upload.single("frame"), uploadScanFrame);

// ==============================
// إنهاء الفحص وتشغيل AI
// POST /api/v1/doctor/scan/:scanId/finish
// ==============================
router.post("/:scanId/finish", finishScan);

export default router;
