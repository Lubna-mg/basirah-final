import fs from "fs";
import path from "path";

export function getScanFolder(scanId) {
  const folder = path.join("uploads", "scans", scanId);
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
  return folder;
}
