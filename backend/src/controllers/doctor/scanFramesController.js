// backend/src/controllers/doctor/scanFramesController.js
import path from "path";
import { getScanFolder } from "../../utils/scanStorage.js";

export const uploadFrame = async (req, res) => {
  if (!req.files || !req.files.frame) {
    return res.status(400).json({ message: "No frame uploaded" });
  }

  const { testId } = req.params; // ✅ تصحيح الاسم
  const frame = req.files.frame;

  const folder = getScanFolder(testId);
  const filename = `frame_${Date.now()}.jpg`;

  await frame.mv(path.join(folder, filename));

  res.json({ success: true });
};
