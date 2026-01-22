import express from "express";
import doctorAuth from "../../middleware/doctorAuth.js";
import { uploadFrame } from "../../controllers/doctor/scanFramesController.js";

import {
  createTest,
  addNoteToTest,
  getTestReport,
  getMyTests,
  getTestsByPatient,
  approveTest,
  deleteTest,
  runTestAI, // ✅ لازم نضيفه هنا
} from "../../controllers/doctor/doctorTestController.js";

const router = express.Router();

/* ===============================
   إنشاء فحص
================================ */
router.post("/", doctorAuth, createTest);

/* ===============================
   فحوصات الطبيب
================================ */
router.get("/", doctorAuth, getMyTests);

/* ===============================
   فحوصات مريض
================================ */
router.get("/patient/:patientId", doctorAuth, getTestsByPatient);

/* ===============================
   إضافة ملاحظة / توصية
================================ */
router.post("/:testId/notes", doctorAuth, addNoteToTest);

/* ===============================
   تقرير الفحص
================================ */
router.get("/:testId/report", doctorAuth, getTestReport);
router.get("/:testId", doctorAuth, getTestReport);

/* ===============================
   تشغيل الذكاء الاصطناعي 🧠🔥
================================ */
router.post("/:testId/run-ai", doctorAuth, runTestAI);

/* ===============================
   اعتماد التقرير
================================ */
router.patch("/:testId/approve", doctorAuth, approveTest);

/* ===============================
   رفع إطارات الكاميرا
================================ */
router.post("/:testId/frames", doctorAuth, uploadFrame);

/* ===============================
   حذف تقرير / فحص 🗑️
================================ */
router.delete("/:testId", doctorAuth, deleteTest);

export default router;
