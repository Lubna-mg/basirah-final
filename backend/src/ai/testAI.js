import { runAI } from "./runAI.js";

const imagesPath =
  "/Users/alhanof/ai_work/asd1/data/augmented_TS";

(async () => {
  try {
    const result = await runAI(imagesPath);
    console.log("🧠 AI RESULT:", result);
  } catch (err) {
    console.error("❌ AI ERROR:", err);
  }
})();
