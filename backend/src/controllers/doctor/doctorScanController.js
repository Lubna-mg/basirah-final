import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import Scan from "../../models/Scan.js"; // لو ما عندك سكيمة بعد قولي

const AI_SCRIPT =
  "/Users/alhanof/ai_work/asd1/ai_inference.py"; // عدلي المسار إذا تغيّر
const PYTHON =
  "/Users/alhanof/ai_work/asd1/.venv/bin/python";

// ======================
// بدء جلسة فحص
// ======================
export const startScan = async (req, res) => {
  try {
    const { patientId } = req.body;

    const scan = await Scan.create({
      patient: patientId,
      framesPath: `ai_frames/${Date.now()}_${patientId}`,
      status: "running",
    });

    fs.mkdirSync(scan.framesPath, { recursive: true });

    res.json(scan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "فشل بدء الفحص" });
  }
};

// ======================
// استقبال صورة
// ======================
export const uploadScanFrame = async (req, res) => {
  try {
    const { scanId } = req.params;
    const scan = await Scan.findById(scanId);

    if (!scan) {
      return res.status(404).json({ message: "Scan غير موجود" });
    }

    const filename = `${Date.now()}.jpg`;
    const filepath = path.join(scan.framesPath, filename);

    fs.writeFileSync(filepath, req.file.buffer);

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "فشل حفظ الصورة" });
  }
};

// ======================
// إنهاء الفحص وتشغيل AI
// ======================
export const finishScan = async (req, res) => {
  try {
    const { scanId } = req.params;
    const scan = await Scan.findById(scanId);

    if (!scan) {
      return res.status(404).json({ message: "Scan غير موجود" });
    }

    scan.status = "processing";
    await scan.save();

    const process = spawn(PYTHON, [
      AI_SCRIPT,
      scan.framesPath,
    ]);

    let output = "";

    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    process.on("close", async () => {
      const result = JSON.parse(output);

      scan.status = "done";
      scan.aiResult = result;
      await scan.save();

      res.json(result);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "فشل تحليل الذكاء" });
  }
};
