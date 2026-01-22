import { runAI } from "./runAI.js";

export async function analyzeEyeTracking(imagesPath) {
  const result = await runAI(imagesPath);

  if (!result.raw) {
    return {
      status: "FAILED",
      summary: "تعذر تحليل بيانات تتبع العين.",
      confidence: null,
    };
  }

  return {
    status: "SUCCESS",
    finalResult: result.label,
    confidence: result.confidence,
    images: result.raw.images,
    asdImages: result.raw.asd_images,
    ratio: result.raw.asd_ratio,
    summary: `
      تم تحليل ${result.raw.images} صورة لمسارات العين.
      نسبة الاشتباه: ${(result.raw.asd_ratio * 100).toFixed(1)}%
      النتيجة المبدئية: ${result.label}
    `,
  };
}
