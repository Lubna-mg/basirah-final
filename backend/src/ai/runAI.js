// backend/src/ai/runAI.js
import { spawn } from "child_process";
import { PYTHON_PATH, AI_SCRIPT } from "./aiConfig.js";

export async function runAI(imagesPath) {
  return new Promise((resolve) => {
    const process = spawn(PYTHON_PATH, [AI_SCRIPT, imagesPath]);

    let output = "";

    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    process.on("close", () => {
      try {
        const jsonStart = output.indexOf("{");
        const raw = JSON.parse(output.slice(jsonStart));

        let label = "Inconclusive";
        if (raw.asd_ratio >= 0.7) label = "ASD";
        else if (raw.asd_ratio <= 0.3) label = "Normal";

        resolve({
          label,
          confidence: raw.asd_ratio,
          heatmapImage: raw.heatmap_path,   // 👈 مهم
          gazeStats: raw.gaze_stats,         // 👈 مهم
          raw,
        });
      } catch (err) {
        console.error("AI parse error:", err);
        resolve({
          label: "Inconclusive",
          confidence: null,
          heatmapImage: null,
          gazeStats: null,
          raw: null,
        });
      }
    });
  });
}
