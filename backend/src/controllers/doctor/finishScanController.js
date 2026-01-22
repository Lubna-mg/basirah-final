import { analyzeEyeTracking } from "../../ai/aiService.js";
import Scan from "../../models/Scan.js";

export const finishScan = async (req, res) => {
  try {
    const { scanId } = req.params;

    const imagesPath = `uploads/scans/${scanId}`;

    // 🧠 تشغيل الذكاء الاصطناعي الحقيقي
    const aiResult = await analyzeEyeTracking(imagesPath);

    const scan = await Scan.findByIdAndUpdate(
      scanId,
      {
        status: "COMPLETED",
        endedAt: new Date(),
        aiResult, // ✅ الآن منظم
      },
      { new: true }
    );

    res.json(scan);
  } catch (err) {
    console.error("finishScan error:", err);
    res.status(500).json({ message: "فشل إنهاء الفحص" });
  }
};
