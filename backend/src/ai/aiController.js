import { analyzeEyeTracking } from "../ai/aiService.js";

export const runEyeTrackingTest = async (req, res) => {
  try {
    // لاحقًا هذا يجي من session أو patient
    const imagesPath =
      "/Users/alhanof/ai_work/asd1/data/augmented_TS";

    const result = await analyzeEyeTracking(imagesPath);

    res.json({
      success: true,
      aiResult: result,
    });
  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({
      success: false,
      message: "AI analysis failed",
    });
  }
};
